const GIT_CRYPT_HEADER = "\0GITCRYPT\0";
const GIT_CRYPT_HEADER_BYTES = new Uint8Array([0, 71, 73, 84, 67, 82, 89, 80, 84, 0]);
const KEY_FILE_HEADER_BYTES = new Uint8Array([0, 71, 73, 84, 67, 82, 89, 80, 84, 75, 69, 89]);

const AES_KEY_LEN = 32;
const HMAC_KEY_LEN = 64;
const NONCE_LEN = 12;
const KEY_FORMAT_VERSION = 2;
const HEADER_FIELD_END = 0;
const KEY_FIELD_END = 0;
const KEY_FIELD_VERSION = 1;
const KEY_FIELD_AES_KEY = 3;
const KEY_FIELD_HMAC_KEY = 5;

type GitCryptKey = {
  version: number;
  aesKey: Uint8Array;
  hmacKey: Uint8Array;
};

export const decryptGitCryptSource = async (source: string, encodedKey: string) => {
  const payload = parseEncryptedSource(source);
  if (!payload) {
    return source;
  }

  const key = parseGitCryptKey(encodedKey);
  const plaintext = await decryptGitCryptPayload(payload, key);
  return new TextDecoder("utf-8", { fatal: true }).decode(plaintext);
};

export const parseGitCryptKey = (encodedKey: string): GitCryptKey => {
  const bytes = decodeTextBytes(encodedKey);

  if (bytes.length === AES_KEY_LEN + HMAC_KEY_LEN) {
    return {
      version: 0,
      aesKey: bytes.slice(0, AES_KEY_LEN),
      hmacKey: bytes.slice(AES_KEY_LEN),
    };
  }

  if (!startsWith(bytes, KEY_FILE_HEADER_BYTES)) {
    throw new Error("Expected a base64 or hex git-crypt key file.");
  }

  const reader = new ByteReader(bytes);
  reader.skip(KEY_FILE_HEADER_BYTES.length);
  const formatVersion = reader.readU32();
  if (formatVersion !== KEY_FORMAT_VERSION) {
    throw new Error("Unsupported git-crypt key format.");
  }

  skipHeaderFields(reader);

  let latest: GitCryptKey | null = null;
  while (!reader.done()) {
    const entry = readKeyEntry(reader);
    if (latest === null || entry.version > latest.version) {
      latest = entry;
    }
  }

  if (!latest) {
    throw new Error("The git-crypt key file does not contain any keys.");
  }

  return latest;
};

export const decryptGitCryptPayload = async (payload: Uint8Array, key: GitCryptKey) => {
  if (payload.length < GIT_CRYPT_HEADER_BYTES.length + NONCE_LEN) {
    throw new Error("Encrypted diary entry is truncated.");
  }
  if (!startsWith(payload, GIT_CRYPT_HEADER_BYTES)) {
    throw new Error("Encrypted diary entry has an invalid git-crypt header.");
  }

  const nonce = payload.slice(GIT_CRYPT_HEADER_BYTES.length, GIT_CRYPT_HEADER_BYTES.length + NONCE_LEN);
  const ciphertext = payload.slice(GIT_CRYPT_HEADER_BYTES.length + NONCE_LEN);
  const counter = new Uint8Array(16);
  counter.set(nonce);

  const cryptoKey = await crypto.subtle.importKey("raw", key.aesKey, "AES-CTR", false, ["decrypt"]);
  const plaintext = new Uint8Array(
    await crypto.subtle.decrypt(
      {
        name: "AES-CTR",
        counter,
        length: 32,
      },
      cryptoKey,
      ciphertext,
    ),
  );

  const hmacKey = await crypto.subtle.importKey(
    "raw",
    key.hmacKey,
    {
      name: "HMAC",
      hash: "SHA-1",
    },
    false,
    ["sign"],
  );
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", hmacKey, plaintext));
  if (!constantTimeStartsWith(digest, nonce)) {
    throw new Error("Encrypted diary entry failed git-crypt integrity check.");
  }

  return plaintext;
};

const parseEncryptedSource = (source: string) => {
  if (source.startsWith("git-crypt:v1:")) {
    return decodeTextBytes(source.slice("git-crypt:v1:".length));
  }
  if (source.startsWith(GIT_CRYPT_HEADER)) {
    return stringToBinaryBytes(source);
  }
  return null;
};

const decodeTextBytes = (text: string) => {
  const normalized = text.replace(/\s+/g, "");
  if (!normalized) {
    throw new Error("Missing git-crypt key.");
  }
  if (/^(?:[\da-f]{2})+$/i.test(normalized)) {
    return hexToBytes(normalized);
  }
  return base64ToBytes(normalized);
};

const base64ToBytes = (base64: string) => {
  const standard = base64.replace(/-/g, "+").replace(/_/g, "/");
  const padded = standard.padEnd(Math.ceil(standard.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

const hexToBytes = (hex: string) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

const stringToBinaryBytes = (value: string) => {
  const bytes = new Uint8Array(value.length);
  for (let i = 0; i < value.length; i += 1) {
    bytes[i] = value.charCodeAt(i) & 0xff;
  }
  return bytes;
};

const skipHeaderFields = (reader: ByteReader) => {
  while (true) {
    const fieldId = reader.readU32();
    if (fieldId === HEADER_FIELD_END) {
      return;
    }
    const fieldLen = reader.readU32();
    reader.skip(fieldLen);
  }
};

const readKeyEntry = (reader: ByteReader): GitCryptKey => {
  let version: number | null = null;
  let aesKey: Uint8Array | null = null;
  let hmacKey: Uint8Array | null = null;

  while (true) {
    const fieldId = reader.readU32();
    if (fieldId === KEY_FIELD_END) {
      break;
    }

    const fieldLen = reader.readU32();
    if (fieldId === KEY_FIELD_VERSION) {
      if (fieldLen !== 4) {
        throw new Error("Malformed git-crypt key version field.");
      }
      version = reader.readU32();
    } else if (fieldId === KEY_FIELD_AES_KEY) {
      if (fieldLen !== AES_KEY_LEN) {
        throw new Error("Malformed git-crypt AES key field.");
      }
      aesKey = reader.readBytes(fieldLen);
    } else if (fieldId === KEY_FIELD_HMAC_KEY) {
      if (fieldLen !== HMAC_KEY_LEN) {
        throw new Error("Malformed git-crypt HMAC key field.");
      }
      hmacKey = reader.readBytes(fieldLen);
    } else {
      if ((fieldId & 1) === 1) {
        throw new Error("Unsupported critical git-crypt key field.");
      }
      reader.skip(fieldLen);
    }
  }

  if (version === null || aesKey === null || hmacKey === null) {
    throw new Error("Malformed git-crypt key entry.");
  }

  return { version, aesKey, hmacKey };
};

const startsWith = (bytes: Uint8Array, prefix: Uint8Array) => {
  if (bytes.length < prefix.length) {
    return false;
  }
  for (let i = 0; i < prefix.length; i += 1) {
    if (bytes[i] !== prefix[i]) {
      return false;
    }
  }
  return true;
};

const constantTimeStartsWith = (bytes: Uint8Array, prefix: Uint8Array) => {
  if (bytes.length < prefix.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < prefix.length; i += 1) {
    mismatch |= bytes[i] ^ prefix[i];
  }
  return mismatch === 0;
};

class ByteReader {
  #offset = 0;

  constructor(private readonly bytes: Uint8Array) {}

  done() {
    return this.#offset === this.bytes.length;
  }

  readU32() {
    const bytes = this.readBytes(4);
    return ((bytes[0] * 0x1000000) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3]) >>> 0;
  }

  readBytes(length: number) {
    if (this.#offset + length > this.bytes.length) {
      throw new Error("Malformed git-crypt key file.");
    }
    const bytes = this.bytes.slice(this.#offset, this.#offset + length);
    this.#offset += length;
    return bytes;
  }

  skip(length: number) {
    this.readBytes(length);
  }
}
