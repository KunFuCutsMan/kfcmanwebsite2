---
title: 'Tabulations'
date: "2026-01-27T22:19:37-06:00"
summary: Shortcode to make tabbed content inside your page bundles.

tags:
    - Programming
    - Hugo

Params:
    Stylesheets:
        - content.css

build:
    publishResources: false

includeTOC: true
excludeArticleData: false
draft: true
---

Greetings! About a month ago I revamped my previous tab window component to use Hugo's page bundles better, so I'd like to share it with you aswell.

## Previous approach

Previously I used three shortcodes which were named, rather creatively, `tab`, `titles`, and `wrapper`. The idea is that when you wish to make a tab, you do the following structure:

```md
{{ < tabs/wrapper >}}

{{ % tabs/titles %}}
* Title 1
* Title 2
* Title 3
{{ %/ tabs/titles %}}

{{ % tabs/tab %}}
Content from tab 1 goes here
{{ % tabs/tab %}}

{{ % tabs/tab %}}
Content from tab 2 goes here
{{ % tabs/tab %}}

{{ % tabs/tab %}}
Content from tab 3 goes here
{{ % tabs/tab %}}

{{ </ tabs/wrapper >}}
```

Which **is a horrible way to do it.** This approach is ok if the contents from your tabs are small, but if when you need to write more than a few paragraphs? That's where this approach breaks. There's no way I'm writing 5000 lines of content ever again on a single page.

So I changed it. You can see the new approach in my [post about my trip to quiahuiztlan](/posts/2026/01/trip-to-quiahuiztlan)

## Now

All you have to do is to invoke the following shortcode:

```md
{{ < tabs tab="directory_name" >}}
```

And go with your day. Here's the code for you to use aswell:

````html
<!-- layouts/shortcodes/tabs.html | Made by [KunFuCutsMan](http://kunfucutsman.neocities.org/) -->
<!--
A shortcode to create tabbed content sections.
ARGUMENTS:
    tab: Name of the directory containning your tabs' contents.
-->
{{- $tabName := .Get "tab" -}}
{{- $tabsPages := .Page.GetPage $tabName -}}
{{- with $tabsPages -}}
<section class="tab-wrapper">
    <ul class="tab-titles inline-list">
        {{- range $index, $tab := $tabsPages.RegularPages }}
        <li>
            <label>
                <input type="radio" name="tabs-{{ $tabName }}" value="{{ $index }}" {{ if eq $index 0 }}checked{{end}}>
                <span>{{ $tab.Title }}</span>
            </label>
        </li>
        {{- end }}
    </ul>
    {{- range $index, $tab := $tabsPages.RegularPages }}
    <article class="tab content" tabindex="0" data-tab="{{ $index }}">
        {{ $tab.Content | safeHTML }}
    </article>
    {{ end }}
</section>
{{ else }}
<p>Error: Couldn't find pages labeled as <b>"{{ $tabName }}".</b></p>
{{ end }}
```

### How to use it