---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
date: "{{ .Date }}"
summary: Summarize all of this article in one sentence or two

tags:
    - Tag 1
    - Tag 2

Params:
    Stylesheets:
        - content.css

build:
    publishResources: false

includeTOC: true
excludeArticleData: false
draft: true
---

## This is post draft

It is se to `draft: true` as default.

Move it to `posts/yyyy/mm` once completed.
