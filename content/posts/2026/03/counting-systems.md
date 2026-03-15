---
title: 'A summary of counting systems'
date: "2026-02-14T21:56:08-06:00"
summary: AKA what KFCMan learnt during the last two weeks
pubDate: "2026-03-14T22:06:00-06:00"

tags:
    - Programming

Params:
    Stylesheets:
        - content.css

build:
    publishResources: false

includeTOC: true
excludeArticleData: false
draft: false
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
| 16   |   (1A4)~16~    | 1x16^2 + 10x16^1 + 4x16^0     |

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

I'll just cover addtion and subtraction, which fortunately follow the same rules as operations in the decimal system. Sum the digits, starting from the least significant digits, and if their result is longer than a single unit, add the more significant digits over the next column. Just keep in mind we may have different coefficents, for example:

```txt
Adding (13A.5B) + (4DE.95) in Hex:

      1 1     1 
      1 3 A . 5 B
    + 4 D E . 9 5
    -------------
      6 1 8 . F 0

Remembering that:
- (B + 5) = (10) = 16
- (5 + 9 + 1) = (F) = 15
- (A + E) = (18) = 24
- (3 + D + 1) = (11) = 17
- (1 + 4 + 1) = 6
```

Don't forget to ask for an the next significant digit to help with subtractions!

```txt

Subtracting (4DE.95) from (13A.5B) in Hex:
      ,       ,
      4 D E . 9 5
    - 1 F A . 5 B
    -------------
      2 C 4 . 3 9

Remembering that:
- (5 < B) so we do (15 - B = 9) instead
- (D < F) so we do (1D - F = C) instead
```

I used a colon to represent when we borrowed a digit, so we subtract 1 to that column aswell.

The same mechanism you use to multiply numbers works here too, but you'll probably need to have a multiplication table in hand. Same with division.

## But wait, there's more!

Which unfortunately I can't go over anymore, otherwise this post ends in draft limbo. Feel free to search any digital systems book to help you learn about the topic.

Here's the stuff which I couldn't fit in because of time:

- Complement to base and complement to base - 1
- Negative numbers represented with sign and complement
- Numeric codes
  - BCD
  - XS3
  - 84-2-1
  - 2421
- Gray Code

All of these topics are useful when designing a system using binary, because we only have to digits to work with. That means we can take shortcuts when performing these operations. For example, the complement of a binary number can be obtained *just by flipping the bits, then adding 1!* Isn't that amazing?

That would be everything for today. I apologize for the lack of PI posting. Good night!

[^1]:
    The only counting system actually used to represent numbers. But Octal and Hex are used to simplify binary sequences.
[^2]:
    Hex can be also abrreviated with the letter "H"
