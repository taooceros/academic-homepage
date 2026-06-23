#import "/content/blog.typ": *
#import "/src/3rd_party/mathyml/lib.typ" as mathyml
#import mathyml.prelude: *

#show: main.with(
  title: "UW-Madison Course",
  desc: "My retrospective of UW-Madison courses.",
  date: "2025-06-08",
  image: "/img.png",
  tags: (
    "undergrad",
    "course",
  ),
)

There are a lot of fun learning at UW-Madison. I will sort them based on the subjects.

#set heading(numbering: "1.")

#outline()

= Math

One of the surpising thing is that UW-Madison has a very strong math department. I personally like the probability theory and stochastic process the most (@probability-theory and @stochastic-process). They are all taught by Prof. Erik Bates (https://www.ewbates.com/). Unfortunately, he is no longer in UW-Madison, but in NCSU.

The hardest math course I took is the Modern Algebra II (@modern-algebra-ii), taught by Prof. Paul Apisa (https://people.math.wisc.edu/~apisa/).

I did take one of the calculus course (Multivariable Calculus, Math 234), but I did not find it very interesting and worth a section. One of my friends took the honors version (Math 375 + 376) which combines calculus and linear algebra and he said it is much more interesting.

== Linear Algebra (341: Sigurd Angenent)

This is the first math course that I found very interesting in UW-Madison. It is taught by Prof. Sigurd Angenent (https://people.math.wisc.edu/~angenent/). The textbook we used is #link("https://www.math.brown.edu/streil/papers/LADW/LADW.html")[Linear Algebra Done Wrong] by Sergei Treil. Prof. Angenent is a very profound math professor. He knows many things about the math history and explains the concept in a very clear way (yet a bit slow, but I won't complain as I suffers so much in Math 542 which is taught really fast). I find the most rewarding part of the course is that it combines the abstract math theory with concrete usage.

The first part that is very interesting is that it views matrix as the representation of linear transformation, which explains why matrix multiplication is defined the way it is.

Another part I like very much is the spectrum theorem and the eigenvalue decomposition, and how it can be used to compute matrix power.

== Probability Theory (431: Erik Bates) <probability-theory>

This is by far my favorite math course in UW-Madison. It is taught by Prof. Erik Bates (https://www.ewbates.com/). We do have a textbook, #link("https://www.amazon.com/Introduction-Probability-Cambridge-Mathematical-Textbooks/dp/1108415857")[Introduction to Probability], which is also written by professors in our school. However, Erik didn't really follow the textbook and instead drives the course in a different order and have his own lecture notes (which is hand written in a very interesting font).

It is a fortune for me to have a chance to take the course with Erik. I wasn't plan to take this course at the first place, as I was afriad whether the courses will be too hard for me as I am having quite a few workload during that semester including Philosophy (@intro-to-philosophy), which I believes I need to spend a lot of time on. However, near the start of the semester, I could only waitlist in the probability theory in the statistics department (Math 309), which I audited and thought it was a super easy course. Luckily, the section Erik is teaching has one last spot. At the sudden I saw that he has a 4.9/5 score on RateMyProfessor, I thought it worth the risk to take it. *It is one of my best decision in UW-Madison.*

Erik is a very nice and interesting guy. He looks very young. At the first time I went to class, I thought I went to the wrong classroom, because the one who stands in front of the blackboard looks like a TA (especially with the red UW-Madison mask). He talks very fast at first, but the lecture is very engaging and I never imagine 50 minutes courses feel so short. He also asks us to write a feedback every two weeks, and read everyone's feedback (even write comments on it) and literally follow some of the feedback to improve the course. For example, he significantly reduces the speed he talks.


#figure(caption: "Erik's funny notes 1")[
  #image("uw-madison-course/431-1.png")
]


Erik hand crafted all of his lecture notes, which I keeps a copy. He has one of the most elegant while cute font I have ever seen in a lecture note. This is really important for me (even though I don't read it that much), as I have no stress not taking note during the class.


#figure(caption: "Erik's funny notes 2")[
  #image("uw-madison-course/431-2.png")
]

One of the most insightful thing I learnt is what Erik is saying at the first lecture. He throws a die to the ground and told us there is no such things as random. Physics determines what the results of the die will be. If we tracks every motion of the die, then we can know the result of the die. However, why do people still say it is "random"? It is because it is very hard to track every motion of the die, but still want to have a _sense_ about what the die will be. Probability is a theory on top of uncertainty.

Erik always pushes us to do is to do _sanity check_. He wants us to have a "sense" about whether a result is making sense and being intuitive. I think this is something everyone should do when learning math, but nobody has emphasized it before Erik. Another outstanding thing that Erik is doing is that he always motivates us about a theory before introducing complicate concepts. One very interesting example is that he first gives a very complex "proof" of the Central Limit Theorem about Sum of binary random variables, and then introduces the generating function and moment generating function to provide a simpler but more general proof.

One thing Erik's version of probability theory that is different from the textbook is that he motivates the concept of _Moment Generating Function_ with the application of proving that _Central Limit Theorem_ (which is why we can use normal distribution almost every where in statistics). He firstly spends a whole lecture walking us through the proof of CLT under binomial cases, which is very complicated and hard to follow.

#figure(caption: "CLT of Binomial Functions")[
  #image("uw-madison-course/431-3.png")
]

Then he introduces the concept of _Moment Generating Function_ and shows how it can be used to prove CLT in a much simpler way. This is a very good example of how to motivate a concept with a real application.

#figure(caption: "Proof of CLT using Moment Generating Function")[
  #image("uw-madison-course/431-4.png")
]


== Schocastic Process (632: Erik Bates) <stochastic-process>

I have the luck to take the stochastic process course with Erik again. It is a really funny course; Strictly speaking, it is much harder compared to @probability-theory, but is still very interesting. Compared to 431 where I don't need much help to finish the homework, I often can't do the homework easily without Erik's help.

One good thing of taking Erik's course is that you get 2 $times$ 2 hours of office hours every week, which is estremely rare for a research professor. It is a very funny enviroment in the office hours, as there are a lot of students and they are all working on different problems. Erik is ease to talk about random stuff, so he always fulfill my curiosity about math and life.

The course contains a few major components:
+ Markov Chain
+ Poisson Process
+ Martingale
+ Probability Generating Function
+ Branching Process (a little bit)

What's interesting about this course is a lot of time we are analyzing a gambling strategy; one interesting example is the following game:




== Analysis (521: Jordan Ellenberg)

== Modern Algebra I (541: Ziquan Yang)

== Modern Algebra II (542: Paul Apisa) <modern-algebra-ii>

= Computer Science

== Algorithm (577: Dieter van Melkebeek)

== Operating System (537: Remzi Arpaci-Dusseau)

== Artificial Intelligence (541: Jerry Zhu)

== Compiler (536: Loris D'Antoni)

== Database (564: Anhai Doan)

= Breath

== Intro to Micro + Macro (Econ 111: Elizabeth Sawyer Kelly)

== Evolution and Existinction (GEO SCI 110: Shanan Peters)

== Intro to Philosophy (Philosophy 101: Steven Nadler) <intro-to-philosophy>

== ENGL 182

== ENGL 140
