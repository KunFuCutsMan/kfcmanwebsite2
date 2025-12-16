---
title: "MPCG 4: Making Tiles Worthy of Display"
date: "2024-11-20T13:08:13-06:00"
summary: It's just some images, right?

series:
    - Making a Pai Sho Capture Game
tags:
    - Programming
    - Pai Sho

Params:
    Stylesheets:
        - content.css

includeTOC: true
excludeArticleData: false
draft: true
---

Greetings! My semester is ending soon, so today I'll show you a small tidbit to make your tiles playable in the future. Let's get started!

## Configuring Parcel so it copies images first

This step may not be necesary depending on how advanced the `parcel-update` branch is, but if it isn't then keep reading.

You may have noticed that in the other games, the images aren't being loaded, so they just appear as missing; this happens for all tilesets, and that's because the _images for the tiles are not in the dist folder._ Let's fix that.

Normally parcel does not copy static files like images on to the `dist` folder, so we'll need have to configure it so it does so. First, check if `package.json` has the following devDependency:

```json
"parcel-reporter-static-files-copy": "^1.5.3",
```

If you don't have it then install it; either way you're going to make a file in the root directory called `.parcelrc` and copy **THIS EXACT JSON FORMAT**. Keep in mind that the keys of the object must not be between quotes because the format parcel decided to handle is _slightly different_ from the normal JSON format. This is JSON5 apparently.

```json5
{
    extends: ["@parcel/config-default"],
    reporters: ["...", "parcel-reporter-static-files-copy"],
    packagers: {
        // ".js": "@parcel/packager-raw-url"
    },
    transformers: {
        "manifest.json": ["@parcel/transformer-webmanifest"],
    },
}
```

You've noticed we added `parcel-reporter-static-files-copy` as a reporter, to quote from the documentation:

{{% cite "[Parcel Documentation](https://parceljs.org/plugin-system/reporter/)" %}}
Reporter plugins receive events from Parcel as they happen throughout the build process. For example, reporters may write status information to stdout, run a dev server, or generate a bundle analysis report at the end of a build.
{{% /cite %}}

During the building process, whenever parcel reaches a static file (like an image) instead of passing over it, it will instead copy it to the `dist` folder, making it accesable to the development server! That's nice isn't?

...

There's one thing I have to mention, though. When I working with the reporter, sometimes it would copy the images as _txt files_ instead of their proper format, therefore when the browser requested the images it couldn't display them because _tecnically they were not images._ Keep that in mind, and if it does happen, it's better for you copy the images yourself and remove any cache you may have.

~Now that that's out of the way...~

## My tiles are unique, right?

TODO:

- How to setup the images for the tiles
- How to name them
- Where to put them

## In the code

TODO:

- GodaiActuator:
  - modify getTileImageSourceDir() so it gets the localstorage name of the folder
    - under the name of some key
  - setup that key somewhere

- Add tile IDs in `Tile.js`
  - Modify `getImageName()`
  - Modify `Tile.getTileName()`
- Add the tileset in `TileManager.js`
  - Clarify that if tiles are already located on board, stuff may change
    - See SpiritGameManager.runNotationMove(), SpiritBoard.placeInitialTiles() & SpiritTile.getStartingPoint()
    - See GinsengGameManager.doBoardSetup(),

## They'll now show up on the board, right?

That's for another entry
