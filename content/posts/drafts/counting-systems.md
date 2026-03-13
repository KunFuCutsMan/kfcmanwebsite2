---
title: 'A summary of counting systems'
date: "2026-02-14T21:56:08-06:00"
summary: AKA what KFCMan learnt during the last two weeks

tags:
    - Programming

Params:
    Stylesheets:
        - content.css

build:
    publishResources: false

includeTOC: true
excludeArticleData: false
draft: true
---

Hello! College is still college so I'm busy!

Want to know what I've been learning? This is a part of the first of my **Digital Electronics** subject.

I really wanted to write everything down, but seeing as I stop developing blog entries past a certain point, it's better for me to keep it short

## Why use different bases?

A **signal** is a segment of information that is transmitted through some medium. The text you are reading right now can be interpreted as a signal, but for the sake of making a signal useful, they're sent with the porpuse of the reciever to act on something.

Within electronics, voltaje is the most common way sending information, as it is a form of potential energy within electricity, to be more precise, **the amount of energy needed to transport an electric charge across a field.** What's funny about voltaje is that in zones of space where the electric field has the same magnitude, **no energy is needed to transport a charge across that zone.** This is why voltaje is useful across electronic systems. The only energy you need to transport that signal is the one needed to make the voltaje difference across two cables (plus a little bit if you take into account the inner resistence of those cables).

The easiest way to transport information is to assign different values to a voltage magnitude. ¿You have 0V? That's 0 (of course), but after that? We now have a problem.

Suppose we set our maximum to 5V and wish to transmit the number `420`, digit by digit. If we divide 5V on to 10 slots to say that each magnitude is correspondent to a digit, so you end up with a table like this:

| Unit  | Magnitude | "   | "   | "   | "   | "   | "   | "   | "   | "   | "   |
| :---: | --------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0-5V  | 0         | 0.5 | 1.0 | 1.5 | 2.0 | 2.5 | 3.0 | 3.5 | 4.0 | 4.5 | 5.0 |
| 10~b~ | 0         | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | xxx |

Which is fine, I guess, but we have a problem now. **Noise.** Noise can alter the meaning of information, and we loose our message. In our previous example, the cap amount of noise needed to alter our digits is ∓0.25V. And a diode uses 0.5V! Even then, what if something alters our message just by existing or emitting foreign electromagnetic waves? **We can't use decimal when transmitting information!**

So what do we do? We use other counting systems. The most commonly used, and that you will encounter in any digital system, are:

- Binary (Base 2)[^1]
- Octal (Base 8)
- Hexadecimal, or Hex if you're in a hurry (Base 16)

## Explanation of counting systems

There's some notation that we need to cover here:

When writing a number in another counting system, and you need to tell in what base it is written in, you sorround the number in parenthesis, and write the base as a suffix, like this:

| Base |     Number     | Decimal equivalent |
| :--- | :------------: | :----------------: |
| 10   |   (420)~10~    |        420         |
| 2    | (110100100)~2~ |        420         |
| 8    |    (644)~8~    |        420         |
| 16   | (1A4)~16~[^2]  |        420         |

Do note that numbers that are already in decimal do not need this extra notation.

Just like in decimal, a counting system with base `r` has `r-1` of coeficients that represent a number, and their position are **weighted,** that is to say, **the digit is multiplied by the base a certain number of times.** In decimal, for example, `420` can be written in its **expanded form** as `4 x 10^2 + 2 x 10^1 + 0 10^0`.

The coefficients are usually represented as `a~n~` where `n` is a natural number less than `r`. Here's the coefficients of the previously mentioned systems:

| Coefficient | Binary | Octal | Decimal |  Hex  |
| :---------: | :----: | :---: | :-----: | :---: |
|    a~0~     |   0    |   0   |    0    |   0   |
|    a~1~     |   1    |   1   |    1    |   1   |
|    a~2~     |        |   2   |    2    |   2   |
|    a~3~     |        |   3   |    3    |   3   |
|    a~4~     |        |   4   |    4    |   4   |
|    a~5~     |        |   5   |    5    |   5   |
|    a~6~     |        |   6   |    6    |   6   |
|    a~7~     |        |   7   |    7    |   7   |
|    a~8~     |        |       |    8    |   8   |
|    a~9~     |        |       |    9    |   9   |
|    a~10~    |        |       |         |   A   |
|    a~11~    |        |       |         |   B   |
|    a~12~    |        |       |         |   C   |
|    a~13~    |        |       |         |   D   |
|    a~14~    |        |       |         |   E   |
|    a~15~    |        |       |         |   F   |

Here's an example of the expanded form of 420, with the digits translated into decimal. You do the math and check the sums are equal to 420.

| Base |     Number     | Expanded Form                 |
| :--- | :------------: | :---------------------------- |
| 10   |   (420)~10~    | 4x10^2 + 2x10^1               |
| 2    | (110100100)~2~ | 1x2^8 + 1x2^7 + 1x2^5 + 1x2^2 |
| 8    |    (644)~8~    | 6x8^2 + 4x8^1 + 4x8^0         |
| 16   | (1A4)~16~[^2]  | 1x16^2 + 10x16^1 + 4x16^0     |

Fractional digits are treated the same as normal, each digit to the left of the dot represents a sum of weights, starting from -1 all the way to minus infinity. The expanded form of 420.75 in octal is:

```txt
(644.6)~8~ = 6x8^2 + 4x8^1 + 4x8^0 + 6x8^-1
```

### How do you convert between systems?

You do something similar to a repeated division by the base, where the remainder is the **equivalent digit**, and the quotient is what you have to divide next. I'll convert `420.69~10` to octal so you can see it:

```txt
     This 0 indicades our conversion is done
     |   6 / 8 = 0 + 6 remainder
     |   |    52 / 8 = 6 + 4 remainder
     |   |    |     420 / 8 = 52 + 4 remainder
     |   |    |     |
     v __v __ v __  v
     0 | 6 | 52 | 420 . 69
         6    4     4 . ...
```

A process similar to this is done when converting fractional parts, but instead of dividing, *we multiply by base*, and whatever number ends up as a whole number is the converted part. The fractional part of this new number is then truncated, and the process repeats.

```txt
    Most of the time, fractionals aren't converted neatly
    in any system, unless they can be built with a fraction
    of the base. I. e. 1/8, 1/64, 1/512, etc.
                      0.16 * 8 = 1.28  |
                 0.52 * 8 = 4.16  |    |
            0.69 * 8 = 5.52  |    |    |
                        |    |    |    |
       __  __   __      v__  v__  v__  v__   __   __
     0 | 6 | 52 | 420 . 69| .52| .16| .28| .24| .92| ...
         6    4     4 . 5    4    1    2    1   ...
```

## Operations

[^1]:
    The only counting system actually used to represent numbers. But Octal and Hex are used to simplify binary sequences.
[^2]:
    Hex can be also abrreviated with the letter "H"
