---
title: 'Figure Shortcode With Webp'
date: "2025-12-27T23:04:14Z"
summary: My figure shortcode that transforms images into webp

tags:
    - Hugo
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

Howdy folks!

As promised in one of my [previous posts](/posts/2025/12/recap-2025), this post provides a tutorial for a shortcode that's included in Hugo, but with some slight modifications to allow me to publish pictures without having bloating space with 1 MB pictures taken from my phone.

## Background

As you're aware both me mentioning it several times, and the footer that's below this page, this website uses Hugo as a static site generator, so that I don't have to worry about HTML when I write whatever, and only focus on writing markdown instead.

The problem with markdown is when you wish to attach images. The default way is like this:

```md
![Description of image](./path/to/image.jpeg)

![Description of image](https://example.com/some-image.png "A more descriptive version of what was written brackets")
```

Which I mean, _it works_, but there are a few problems with approach:

1. When parsed, the URL for the image is pasted **EXACTLY** as it is written, therefore you either have to write full URLs, or accept you're writing relative URLs in to your content.
   - This is fine for external images, as they're hosted on another website so there's not a lot to worry about.
2. The parsed image is simply exported as its correspondent `<img>` tag, only with the `alt` (whatever is provided in brackets) and `title` if you're felling fancy. Want to provide a description that's actually readable by users? Good luck!
3. The image linked is passed by Hugo as it is. Even if it's heavy. Why is my website so heavy all of the sudden? Well, you tons of images and they're all sitting right there, with all of their high quality (and huge size) there on your page.

Thankfully, Hugo provides a solution for this: a [figure shortcode](https://gohugo.io/shortcodes/figure/) that uses the `<figure>` tag instead. What's good about this element is that it allows to build a image with a caption, and the possibility of even linking any hyperlink around the image, without having to do some crazy HTML/JS magic. It's simple and effective.

[Shortcodes](https://gohugo.io/content-management/shortcodes/) in Hugo are snippets of templates you can summon in your markdown, allowing you to do use custom elements inside your file without having to write it every time. Check out the documentation for a better explanation.

Finally [WEBP](https://en.wikipedia.org/wiki/WebP) is an image format developed by Google in 2010, and first implemented in 2018, made with the sole porpuse of reducing image sizes on the internet. You may remember it with bad faith as "that one format no one supported" back when it was first launched, but now it's everywhere, if you look hard enough.

## The shortcode itself

If you're impatient and want the shortcode, here it is. Name it `figure.html`, place it under `layouts/shortcodes/` and you're ready to go.

```html
<!-- figure.html | Modified by [KunFuCutsMan](http://kunfucutsman.neocities.org/) -->
<figure{{ with .Get "class" }} class="{{ . }}"{{ end }}>
  {{- if .Get "link" -}}
    <a href="{{ .Get "link" }}"{{ with .Get "target" }} target="{{ . }}"{{ end }}{{ with .Get "rel" }} rel="{{ . }}"{{ end }}>
  {{- end -}}

  {{- $u := urls.Parse (.Get "src") -}}
  {{- $src := $u.String -}}
  {{- if not $u.IsAbs -}}
    <!-- If its a local image target to webp. Gotta save resources man. -->
    {{- $hint := "photo" -}}
    {{- with .Get "hint" -}}{{- $hint = . -}}{{- end -}}

    {{- with $img := (or (.Page.Resources.Get $u.Path) (resources.Get $u.Path)) -}}
      {{- $reduceHeight := "" -}}
      <!-- If it's a tall image then shorten it -->
      {{- if ge $img.Height ( math.Mul $img.Width 1.5 ) -}}
        {{- $reduceHeight = "resize x500" -}}
      {{- end -}}

      {{- $img = $img.Process (println $reduceHeight "webp" $hint) -}}
      {{- $src = $img.RelPermalink -}}
    {{- end -}}
  {{- end -}}

  <img src="{{ $src }}"
    {{- if or (.Get "alt") (.Get "caption") }}
    alt="{{ with .Get "alt" }}{{ . }}{{ else }}{{ .Get "caption" | markdownify| plainify }}{{ end }}"
    {{- end -}}
    {{- with .Get "loading" }} loading="{{ . }}"{{ end -}}
  ><!-- Closing img tag -->
  {{- if .Get "link" }}</a>{{ end -}}
  {{- if or (or (.Get "title") (.Get "caption")) (.Get "attr") -}}
    <figcaption>
      {{ with (.Get "title") -}}
        <h4>{{ . }}</h4>
      {{- end -}}
      {{- if or (.Get "caption") (.Get "attr") -}}<p>
        {{- .Get "caption" | markdownify -}}
        {{- with .Get "attrlink" }}
          <a href="{{ . }}">
        {{- end -}}
        {{- .Get "attr" | markdownify -}}
        {{- if .Get "attrlink" }}</a>{{ end }}</p>
      {{- end }}
    </figcaption>
  {{- end }}
</figure>
```

### How to use

This shortcode has the same parameters as [its original counterpart](https://gohugo.io/shortcodes/figure/#arguments), but has a new parameter called **hint**. This parameter can be one of five encoding parameters for webp, and allows the compiler to know what kind of image we're dealing with. As explained [in Hugo's Image Processing documentation](https://gohugo.io/content-management/image-processing/#hint):

|   Value   | Example                                                                 |
| :-------: | :---------------------------------------------------------------------- |
|  `photo`  | An image with natural lighting. The processing you'll most commonly use |
| `picture` | An image taken from indoors. Another processing you'll most likely use  |
| `drawing` | An image with high-contrasting details                                  |
|  `icon`   | Small images, or even pixel art                                         |
|  `text`   | Images with text, duh                                                   |

If you're not providing this **argument**, then it defaults to `photo`. Anything else that isn't one of these five values will break the shortcode.

There is one final thing you need to consider when you use this shortcode. **INCLUDE THE FOLLOWING FRONT MATTER PARAMETERS TO THE PAGES YOU'RE USING THIS SHORTCODE TO:**

```yaml
build:
    publishResources: false
```

Adapt it your preferred front matter format as needed, what is essential is the parameter `build.publishResources` to be equal to `false`. This parameter is a [build parameter](https://gohugo.io/content-management/build-options/) that tells Hugo to only publish resources that are linked in the page, and only that.

Say you're structure of your content is the following:

```txt
content/
    _index.md
    posts/
        _index.md
        my-first-post/
            index.md
            image.jpeg
```

And you're using this shortcode to link image.jpeg since it somehow weighs 500kb. If you do not include `build.publishResources = false` on the front matter of `posts/my-first-post/index.md`, this will happen when Hugo builds your content:

```txt
index.html
posts/
    index.html
    my-first-post/
        index.html
        image.jpeg
        image_hu_qponj03k.webp
```

As you can see, both the transformed webp image AND the original will be published to your transformed markdown, which defeats the porpuse of using webp to save up on space in the first place.

So don't forget that.

### Example

Going back to the structure I presented earlier, suppose this is the content inside `posts/my-first-post/index.md`:

```md
---
title: 'My first post
---

Hello! This is my first post!

{ {<figure
    src="./image.jpeg"
    alt="A portrait of myself"
    caption="This is me! Hello!"
    hint="picture"
>}}
```

The shortcode will be renderred as something like this:

```html
<figure>
    <img src="https://example.com/posts/my-first-post/image-hu_aso5ijds.webp"
    alt="A portrait of myself">
    <figcaption>
        <p>This is me! Hello!</p>
    </figcaption>
</figure>
```

Simple as that. Just make sure that the shortcode's beginning is handled properly. I included a space in there so Hugo doesn't think it's the actual shortcode I'm trying to call.

## An explanation of how it works

Oh, so are you interested in how this shortcode works?

Well, you're in luck!

...
