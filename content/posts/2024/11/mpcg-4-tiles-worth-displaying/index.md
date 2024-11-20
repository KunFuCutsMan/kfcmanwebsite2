---
title: "MPCG 4: Making Tiles Worthy of Display"
date: "2024-11-20T13:08:13-06:00"
summary: Summarize this article and what it does in regards to the series it belongs to

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

## My tiles are unique, right?

TODO:

-   How to setup the images for the tiles
-   How to name them
-   Where to put them

## In the code

TODO:

-   Add tile IDs in `Tile.js`
    -   Modify `getImageName()`
    -   Modify `Tile.getTileName()`
-   Add the tileset in `TileManager.js`
    -   Clarify that if tiles are already located on board, stuff may change
        -   See SpiritGameManager.runNotationMove(), SpiritBoard.placeInitialTiles() & SpiritTile.getStartingPoint()
        -   See GinsengGameManager.doBoardSetup(),

## They'll show up on the board, right?

That's for another entry
