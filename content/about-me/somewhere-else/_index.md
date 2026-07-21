---
title: 'Find me Somewhere Else'
date: "2026-04-04T23:00:42-06:00"
summary: Summarize all of this article in one sentence or two

Params:
    Images:
        Satellite: ./satellite antenna.gif
    Scripts:
        - somewhere-else.js
    Stylesheets:
        - content.css
        - somewhere-else.css

type: about
layout: somewhere-else

build:
    publishResources: true

cascade:
- build:
    list: local
    publishResources: false
    render: never

---
