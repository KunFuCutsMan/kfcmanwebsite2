---
cascade:
- build:
    list: local
    publishResources: false
    render: never

build:
    list: never
    render: never
---

# THIS MARKDOWN CONTENT WILL NOT APPEAR ON YOUR MAIN PAGE

Make sure that this is archetype is made as a **branch bundle** (`_index.md`), as the leaf bundles will be your tabs.

Each tab should be a **leaf-bundle**, ideally with an unique name to differenciate it from other tabs. The name of the file does not matter, as the `title` parameter will be used instead. The content matter of these tabs should be:

```yaml
title: Title of your tab
weight: 1 # Especify order of your tabs
```

Any titles that appear in those tabs will count towards `.TableOfContents` from the main page.

---

The structure of your page using the `tabs` shortcode will look like this:

```txt
main-mage/
    index.md
    images.jpg
    tabs-folder/
        _index.md
        tab-1.md
        tab-2.md
    other-tabs/
        _index.md
        lorem.md
        ipsum.md
```

And when invoking the shortcode, the `dir` parameter should direct to the name of the directory that stores your tabs. In the previous example, `./tabs-folder` or `./other-tabs`.
