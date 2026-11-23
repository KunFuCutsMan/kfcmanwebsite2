---
title: 'Thanks you for the Libre Office!'
date: "2026-11-21T21:39:08-06:00"
summary: "For giving it to me. (AKA finishing this semester)"

tags:
    - Something I learnt

Params:
    Stylesheets:
        - content.css

build:
    publishResources: false

includeTOC: true
excludeArticleData: false
draft: true
---

Hello! Long time no see! Can you guess the reason I haven't been active as
much as I would have liked to?

Of course, it's college. I've already written several posts regarding my
experiences in college, mostly about the inexplicable weather we're allowed
to go with or being busy with assignments. This time I will write about
something _slightly_ more positive: **how I've been using LibreOffice to**
**create my documents and reports.**

For those who do not know, [LibreOffice](https://www.libreoffice.org/) is a
bundle of office suite programs that can be used to create documents,
spreadsheets, presentations, etc. If those words were magic to you, LibreOffice
is an open source alternative to Microsoft Office. Over the lasts month I have
been writing many reports with Writer and found LibreOffice's templating
functions rather useful. Add to this and me finding ["Domando al Escritor"](https://elpinguinotolkiano.wordpress.com/domando-al-escritor-2/)
by Ricardo Gabriel Berlasso[^1], and my experience has been very smooth so far.

Templates are a function that allows to create a "template" (duh) for future
documents to be based on. They'll usually have a skeleton layout for you to
start whatever you need to write to, without having to copy and paste all the
boilerplate from documents from previous iterations. The styles from the
template get passed to the children documents, and you can even make templates
_based on other templates._ How wonderful!

As such I made a layout called "TecNM"[^2] that I'll be using from now on for
anything related to my degree, with Arial 12, numbered pages, a front page, and
two sections reserved for summaries and bibliography lists. And orange tables,
because I like orange :). Similarly, I made another layout specifically for
lab reports which remove the bibliography for titles for everything I need to
include in them.

The advantage is clear, no need to waste time with rearranging _that one empty_
_page **that APPEARED OUT OF NOWHERE!!!**_

I also have to mention Writer's reference system, which automatizes the process
of linking images, tables and sources within the text without having to manage
the number of each object when referring to it. These references are created
whenever you introduce a legend on an object, and can be inserted into a
paragraph using the "Reference" tool. These references can then appear by
category and number, full text, number page or even as "above"/"below".

Citations are done similarly, however the information of your sources must be
saved either on a database shared across the suite, or within the document
itself, and how they display in the bibliography list can be edited to your
liking. This is the only downside I can say about this system, as there are no
preset layouts for citation styles. I'll have to modify my template when I have
the time.

## Draw and Math

**Draw** is a multipurpose drawing tool that is primarily useful for diagrams,
as you can only insert basic shapes and lines, and move them around a page. I
have been using Draw for this exact purpose and have gotten some decent
results, as shown in the image below. There is an option to hold Draw documents
inside Writer documents, but its rather wonky to work like that, so I export a
page as an SVG instead.

{{<figure
  src="./Practica 9 Diagrama Práctica.svg"
  caption="SVG diagram of a motor connected to a drum rotor via a flat belt, with a vibration analyzer attached to rotor's axle."
  hint="none"
>}}

LibreOffice has its own tool to write mathematical equations creatively named
**Math**, which draws equations given some plain text. I'd say this tool is
better than  whatever Word provides solely because you actually see what you're
writing. You can insert equation objects by pressing `Shift+Alt+E` and press
`Esc` when you're done. More information about Math can be found in the
[Getting Started Guide](https://books.libreoffice.org/en/GS262/GS26209-GettingStartedWithMath.html).

* You can wrap anything inside curly brackets `{}` to treat anything as a
  single object. This is useful when you need to write divisions, like this:

```txt
tan %phi = { sin %phi } over { cos %phi }
```

* As you can see from the example above, functions are written plainly, and
  there are options for writing their versions in other languages.
* You can introduce symbols by prefixing `%` and the symbol's name. For Greek
  letters, write its name in lowercase or uppercase if you want that version of
  the letter.
* Normally when writing parenthesis or brackets, they will appear as the
  character itself instead of wrapping around an equation. If you want this
  behavior you must write `left (` and `right )` before and after whatever you
  wish to wrap, usually you surround it with curly brackets too.

## Some tips for using Writer

* You can access a command bar by pressing `Shift+Esc` to all the commands and
  tools within the program.
* There exists automatic substitutions for common boiler plate, but the most
  important of them all; in my opinion; is `NUM`. This substitution creates an
  invisible table that contains an equation and a text reference you can link
  within the text. This reference is under the "Text" category and only shows
  the number of the equation in parenthesis.
* Make sure that, when inserting images, they are anchored to the page via
  **a paragraph;** not by a character, the default setting. Once you've moved
  your image where you need it to be, select it and use the "Legend" tool to add
  a legend to it and contain it inside a frame. This frame can be moved around
  without the weird effects you see on Word.
* Speaking of images and frames, their text wrapping around them can be set to
  "None" if the frame needs to stand alone, or "Ideal" if you want to move it to
  the side and let the text flow naturally.

---

That's pretty much everything. Toodles!

[^1]:
    A version in English and Italian of the book on the site, if you'd like to
    read the e-book.

[^2]:
    How original.
