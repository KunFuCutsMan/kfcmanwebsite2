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

```html
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

```css
/* Tabs shortcodes */

.tab-wrapper {
    border-radius: 0.5rem;
    background-color: var(--gray-300);
    padding: 0.5rem;
}

.tab-wrapper > .tab-titles li {
    display: inline-block;
    background-color: var(--gray-300);

    margin-block: 0;
    margin-inline: 0;
    padding-block: 0.5rem;
    padding-inline: 1rem;

    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;

    cursor: pointer;
    transition: 200ms;
}

.tab-wrapper > .tab-titles label { cursor: pointer; }
.tab-wrapper > .tab-titles li:has( input:checked ) { background-color: var(--gray-200); }
.tab-wrapper > .tab-titles li:has( input:focus-visible ) { background-color: var(--gray-400); outline: auto; }
.tab-wrapper > .tab-titles li:has( :hover ) { background-color: var(--gray-500); }
.tab-wrapper > .tab-titles li:hover:has( input:checked ) { background-color: var(--gray-400); }
.tab-wrapper > .tab-titles input { height: 0; width: 0; }

.tab-wrapper > .tab { display: none; }

.tab-wrapper > :is(
    .tab-titles:has( input[value="0"]:checked ) ~ .tab[data-tab="0"],
    .tab-titles:has( input[value="1"]:checked ) ~ .tab[data-tab="1"],
    .tab-titles:has( input[value="2"]:checked ) ~ .tab[data-tab="2"],
    .tab-titles:has( input[value="3"]:checked ) ~ .tab[data-tab="3"],
    .tab-titles:has( input[value="4"]:checked ) ~ .tab[data-tab="4"],
    .tab-titles:has( input[value="5"]:checked ) ~ .tab[data-tab="5"],
    .tab-titles:has( input[value="6"]:checked ) ~ .tab[data-tab="6"],
    .tab-titles:has( input[value="7"]:checked ) ~ .tab[data-tab="7"],
    .tab-titles:has( input[value="8"]:checked ) ~ .tab[data-tab="8"],
    .tab-titles:has( input[value="9"]:checked ) ~ .tab[data-tab="9"],
    /* Increase as needed */
)
{
    display: block;
    background-color: var(--gray-200);
    padding: 1rem;
}
```

### How to use it

The most important thing you should do is to change whatever page you're using this shortcode to a [branch bundle](https://gohugo.io/content-management/page-bundles/#branch-bundles). What it means is that **you must name the markdown file `_index.md`.** This is so that Hugo can know there are descendant pages inside your current page, and should look for them.

Your tabs should be in a directory as [leaf bundles](https://gohugo.io/content-management/page-bundles/#leaf-bundles), and if you're going to include any resources inside a tab, then they should be inside the leaf bundle instead. The directory should also be marked as a branch bundle aswell.

You got all that? Good. Here's an example directory:

```txt
main-mage/
    _index.md    <------- Calls tabs shortcode
    images.jpg
    tabs-folder/
        _index.md
        tab-1.md
        tab-2.md
        tab-3/
            index.md
            some-gif.avi
    other-tabs/
        _index.md
        lorem.md
        ipsum.md
```

Inside `main-page/tabs-folder/_index.md`, this branch bundle should have the following front matter:

```yaml
# Makes sure the tabs can only be read by main-page/tabs-folder/_index.md
# And not render them with HTML
cascade:
- build:
    list: local
    publishResources: false
    render: never

# Makes sure the tabs can be read by main-page/_index.md
# And not rendered by Hugo
build:
    list: local
    render: never
```

Every other tab can then have the following front matter, along with the content you'll write on each tab:

```yaml
title: Title of your tab
weight: 1 # Especify order of your tabs
```

The order of your tabs will be decided by the `weight` parameter, which allows you normally to order pages in to any other you want then searching for them via the `.RegularPages` method.

Finally, you may notice that `main-page/_index.md` renders as your site's section content. This is normal, though unexpected behavior, because Hugo thinks that your page is a section because it's a branch bundle, and branches have children, and those children should be accesible inside your page. However,
