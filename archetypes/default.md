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

includeTOC: true
excludeArticleData: false
draft: true
---
