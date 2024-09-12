---
title: "MPCG 2: Setting everything up, actually"
date: "2024-09-12T09:02:51-06:00"
summary: Because I've realised you need to setup your coding enviroment first 😅

series:
    - Making a Pai Sho Capture Game
tags:
    - programming
    - pai sho

includeTOC: true
draft: true
---

Hello! Unlike my previous psot in the series, I've now realized that I should take an entry into explaning how to setup your coding enviroment and have everything before we _actually get into coding_, so this entry will help you with that!

## Ok what do I actually need?

You're going to need some things:

1. You need [Git](https://git-scm.com/) installed in your computer. Git is a version control program that saves all of your progress in a tree like manner, and either save it locally or online (which means you can get the code from other people and modify to your own whim).
2. A [GitHub Account](https://github.com/). Mind you, Github and Git are _different concepts_, Github is basically a giant storage to store all of your Git branches online so people can contribute to them. Git is what does all the heavy lifting of managing the versions of your code.
3. Some coding enviroment like [Visual Studio Code](https://code.visualstudio.com/). It's lightweight and has easy integration with Git and Github (if you have them installed in your computer)
4. Beginning-Medium knowlodge of Javascript; if you've been anywhere near the internet you've certainly heard about this language, it runs on your browser, but due to dependencies (and the server we'll use to simulate the site) we'll actually need to run it on _your own computer instead_. Don't worry, because we also need...
5. [Node](https://nodejs.org/). Node is a runtime enviroment that is basically a browser that _only knows how to run Javascript, and nothing else._ We're going to run a server on there so your browser can get files without having issues with CORS policies or stuff like that.
6. [NPM](https://www.npmjs.com/). NPM or Node Package Manager is a package service that is a neccesity when working with any javascript projects. It handles all the libraries needed for a project and helps with command shortcuts and other stuff.
    - Granted, NPM is not the best package manager to work with, but it's the most common solution and its the one used by Skud's website
7. Your pai sho variant's rules ready for reference. I'm assuming you've already played with your variant in SkudPaiSho's playground and already know all the rules of your game.
    - You'll also need to think and translate your rules into code, so if you have any complicated rules, then you're out of luck. But hey! There are many people in the community who can help you with any problems you have!

From now on I'll be assuming you have knowledge in all of these things. Any questions you may have can be found easily on youtube, some channels I recommend are [Awesome](https://www.youtube.com/@awesome-coding), [Web Dev Simplified](https://www.youtube.com/@WebDevSimplified) and [Fireship](https://www.youtube.com/@Fireship).

{{< small >}}You got everything installed? Good, next up...{{< /small >}}

## Getting a copy of the code
