import { expect, test } from "bun:test";
import { decryptGitCryptSource, parseGitCryptKey } from "./gitCrypt";

const legacyKey = "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5f";
const encryptedHello = "git-crypt:v1:AEdJVENSWVBUADt5MPsIl4CApecYDJYOmtV79yAhJMeNeXFFDJE=";

test("decrypts a git-crypt AES-CTR/HMAC-SHA1 payload", async () => {
  await expect(decryptGitCryptSource(encryptedHello, legacyKey)).resolves.toBe("hello git-crypt\n");
});

test("passes through plain local diary source", async () => {
  await expect(decryptGitCryptSource("#show: doc => doc", legacyKey)).resolves.toBe("#show: doc => doc");
});

test("rejects encrypted payloads with the wrong HMAC key", async () => {
  const key = parseGitCryptKey(legacyKey);
  const wrongKey = new Uint8Array(96);
  wrongKey.set(key.aesKey);
  wrongKey.set(key.hmacKey, 32);
  wrongKey[95] ^= 1;

  const wrongKeyBase64 = btoa(String.fromCharCode(...wrongKey));
  await expect(decryptGitCryptSource(encryptedHello, wrongKeyBase64)).rejects.toThrow("integrity check");
});
