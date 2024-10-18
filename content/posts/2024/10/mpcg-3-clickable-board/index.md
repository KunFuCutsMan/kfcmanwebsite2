---
title: "MPCG 3: Making a Clickable Board"
date: "2024-10-13T20:40:41-06:00"
summary: A pai sho board is not what you think it is.

series:
    - Making a Pai Sho Capture Game
tags:
    - programming
    - pai sho

includeTOC: true
excludeArticleData: false
draft: true
---

{{% small %}}Oh boy another _multi day post..._{{% /small %}}

Greetings! As promised in this part of the series we'll make a clickable board for you to play in. This is what we expect to be our end result:

[[TODO: Add a gif of the expected result]]

But to reach that we need to modify some files so that the website registers that there is a new pai sho variant in town, so let's start with that first.

## There's a Controller on your lawn

Locate the file named `js/PaiShoMain.js` and open it. You'll encounter around 5.8k lines of codes that are used to run the site in a (semi smootly way). `PaiShoMain.js` contains many functions which are called throught the html, but we won't be touching those. Instead, locate a variable that's somewhere near line 2600 that's called **GameType**, it should be an object with a format like the following:

```js
export var GameType = {
    SkudPaiSho: {
        id: 1,
        name: "Skud Pai Sho",
        desc: "Skud Pai Sho",
        description:
            "Arrange flowers into position while changing the landscape of the board to outpace your opponent.",
        coverImg: "skud.png",
        color: "var(--skudcolor)",
        rulesUrl: "https://skudpaisho.com/site/games/skud-pai-sho/",
        gameOptions: [
            OPTION_INFORMAL_START,
            OPTION_DOUBLE_ACCENT_TILES,
            OPTION_ANCIENT_OASIS_EXPANSION,
            NO_HARMONY_VISUAL_AIDS,
            NO_WHEELS,
            SPECIAL_FLOWERS_BOUNCE,
            NO_ALT_WIN,
        ],
        secretGameOptions: [
            DIAGONAL_MOVEMENT,
            EVERYTHING_CAPTURE,
            IGNORE_CLASHING,
            VARIABLE_ACCENT_TILES, // In development
        ],
    },
    VagabondPaiSho: {
        id: 2,
        name: "Vagabond Pai Sho",
        desc: "Vagabond Pai Sho",
        color: "var(--vagabondcolor)",
        description:
            "Construct a battlefield by deploying tiles across the board, then attack your opponent’s Lotus tile.",
        coverImg: "vagabond.png",
        rulesUrl: "https://skudpaisho.com/site/games/vagabond-pai-sho/",
        gameOptions: [OPTION_DOUBLE_TILES, SWAP_BISON_WITH_LEMUR],
    },
    // ...
};
```

The object is too big for me to copy in this post, but you get the idea. This variable holds the information of the games available on the site, which thanks to some DOM magic are then displayed on the modal that appears when you want to create a new game. You'll need to modify this so you can create a new game.

Add an entry to the object like the following, modifying the values as necesary:

```js
export var GameType = {
    // ...
    },
    GodaiPaiSho: {
		id: 42069, // Funny random number hehe
		name: "Godai Pai Sho", // Name of your game
		desc: "Godai Pai Sho", // Same as above
		color: "var(--othercolor)", // Unless you a especific color in mind and want to modify the CSS, just keep this variable as it is.
		description: "Capture your opponents elemental tiles while protecting your own", // If you're using the Chugi theme, this is what will appear on the card
		coverImg: "lotus.png", // Same as color, unless you want to upload an image, just stay with the lotus icon
		rulesUrl: "https://tinyurl.com/65frxu6h", // Your rules are here
		gameOptions: [ // Refer to the next subsection
			GODAI_BOARD_ZONES,
			GODAI_EMPTY_TILE,
		]
	}
};
```

### What is with `gameOptions`?

Glad you asked! Those constants you see are defined in another file called `js/GameOptions.js`. So go to that file and your optional rules at around line 215 like so:

```js
//...

/* Godai */
export var GODAI_BOARD_ZONES = "GodaiBoardZones";
gameOptionDescriptions[GODAI_BOARD_ZONES] = "Board Zones: Rivers & Mountains";

export var GODAI_EMPTY_TILE = "GodaiEmptyTile";
gameOptionDescriptions[GODAI_EMPTY_TILE] = "Play with Empty tile";

/* -------- */

// ...
```

You'll create a new string variable which will be used to identify your optional rule, then add your description to the map called `gameOptionDescriptions`, with a short description of the rule. Whatever you write in there will appear listed when you create a new game, so be descriptive!

Below you'll also find the way for you to check if a game option is active, `gameOptionEnabled(optionName)`, with the parameter being the key of your game option you want to check. For example, if I want to check that the host decided to play with an empty tile, I'd do the following:

```js
// Import the function and the correspondent optional rule key
import { gameOptionEnabled, GODAI_EMPTY_TILE } from "../GameOptions";

// ...

if (gameOptionEnabled(GODAI_EMPTY_TILE)) {
    // Do stuff
}
```

### You control my life (only on javascript tho)

The only other modification we'll have to do on `PaiShoMain.js` is on the function called `getGameControllerForGameType(gameTypeID)`, near line 2950. Modify the function so the switch statement is like so:

```js
export function getGameControllerForGameType(gameTypeId) {
    var controller;

    var isMobile = mobileAndTabletcheck();

    switch (gameTypeId) {
        case GameType.SkudPaiSho.id:
            controller = new SkudPaiShoController(gameContainerDiv, isMobile);
            break;
        case GameType.VagabondPaiSho.id:
            controller = new VagabondController(gameContainerDiv, isMobile);
            break;

        // ...

        case GameType.GodaiPaiSho.id: // Add your GameType date here
            controller = new GodaiController(gameContainerDiv, isMobile);
            break;
        default:
            debug("Game Controller unavailable.");
    }

    return controller;
}
```

This function is the key for the site gaining access to your game. Remember the [huge class diagram]({{< ref "posts/2024/08/mpcg-1-explanation-of-code/#class-diagram-of-a-pai-sho-game" >}}) from the first entry of this series? This function is called a few lines later on a global variable all around `PaiShoMain.js`. If you want to loose your sanity, search up `gameController` on that file and try to discover all the methods called on the object. Don't do it. Instead create your first file on your pai sho folder like so:

```txt
└─ js
   ├─ ActuatorHelp.js
   ├─ AppCaller.js
   ├─ ...
   ├─ godai <--- Change it according to your variant, all in lowercase
   │  ├─ GodaiController.js   <--- Create your file controller here
   ├─ hexentafl
   ├─ honorary-titles
   ├─ ...
   └─ vagabond
```

And inside make a class skeleton like the following:

```js
export class GodaiController {
    /** @type {GodaiActuator}          */ actuator;
    /** @type {GodaiGameManager}       */ theGame;
    /** @type {GodaiNotationBuilder}   */ notationBuilder;
    /** @type {GodaiGameNotation}      */ gameNotation;
    /** @type {GodaiBoardPoint | null} */ mouseStartPoint;
    isPaiShoGame = true;

    /**
     * @param {HTMLDivElement} gameContainer This is the div element that your game needs to be put in
     * @param {boolean} isMobile Boolean flag for if running on mobile device
     */
    constructor(gameContainer, isMobile) {
        this.actuator = new GodaiActuator(
            gameContainer,
            isMobile,
            isAnimationsOn()
        );

        this.resetGameManager();
        this.resetNotationBuilder();
        this.resetGameNotation();
    }

    getGameTypeID() {
        return GameType.GodaiPaiSho.id
    }

    completeSetup() {
        rerunAll()
        this.callActuate()
    }

    resetGameManager() {
        this.theGame = new GodaiGameManager(this.actuator)
    }

    resetNotationBuilder() {
        this.notationBuilder = new GodaiNotationBuilder()
    }

    resetGameNotation() {
        this.gameNotation = this.getNewGameNotation()
    }

    getNewGameNotation() {
        return new GodaiGameNotation()
    }

    callActuate() {
        this.theGame.actuate()
    }
    resetMove() {
        if (this.notationBuilder.status === BRAND_NEW) {
            this.gameNotation.removeLastMove()
        }
        rerunAll()
    }
    cleanup()
    isSolitaire() { return false }
    getAiList() { return [] }
    getCurrentPlayer() {
        if (this.gameNotation.moves.length % 2 == 0)
            return GUEST
        return HOST
    }

    /** @param {HTMLDivElement} tileDiv */
    unplayedTileClicked(tileDiv) {}

    /** @param {HTMLDivElement} htmlPoint */
    RmbDown(htmlPoint) {}

    /** @param {HTMLDivElement} htmlPoint */
    RmbUp(htmlPoint) {}

    /** @param {HTMLDivElement} htmlPoint */
    pointClicked(htmlPoint) {}

    /**
     * @param {HTMLDivElement} htmlPoint
     * @returns {{heading: string, message: Array<string>} | null}
     */
    getPointMessage(htmlPoint) {}

    /** @returns {string} */
    getDefaultHelpMessageText() {}

    /** @returns {string} */
    getAdditionalMessage() {}

    /**
     * @param {HTMLDivElement} tileDiv
     * @returns {{heading: string, message: Array<string>}} Message of the tile, given by `getTheMessage(tile, ownerName)`
     */
    getTileMessage(tileDiv) {
        let divName = tileDiv.getAttribute("name")
        let tile = new GodaiTile(divName.substring(1), divName.charAt(0))
        let ownerName = divName.startsWith('G') ? GUEST : HOST
        return this.getTheMessage(tile, ownerName)
    }

    /**
     * Get the information of a especific tile.
     * @param {GodaiTile} tile
     * @param {string} ownerName
     * @returns {{heading: string, message: Array<string>}} Information to display
     */
    getTheMessage(tile, ownerName) {}

    /** @returns {string} */
    static getHostTilesContainerDivs() {}

    /** @returns {string} */
    static getGuestTilesContainerDivs() {}
}
```

## Spooky Scary Skeleton Files

If you've copied the code then you must have realised that there are tons of imports for you to do, right now you only need to take care of building the classes for your `Actuator`, `GameManager`, `NotationBuilder`, `Board`, and `BoardPoint`, along with importing the functions that are located on `PaiShoMain.js`.

Here are the skeletons of the classes you need to do, name them accordingly and on the same folder as your controller class:

> NOTE: I've added some comments that were not originally in the source code for Godai, you can check them under the label that is in quote space. Search for them as `NOTE: [note here]`

{{< tabs/wrapper >}}

{{% tabs/titles Name="Skeleton Classes" %}}

-   [Variant]Actuator.js
-   [Variant]GameManager.js
-   [Variant]Notation.js
-   [Variant]Board.js
-   [Variant]BoardPoint.js

{{% /tabs/titles %}}

{{% tabs/tab title="[Variant]Actuator.js" %}}

```js
export class GodaiActuator {
    /** @type {HTMLDivElement} */ gameContainer;
    /** @type {boolean}        */ isMobile;
    /** @type {boolean}        */ animationOn;
    /** @type {HTMLDivElement} */ boardContainer;
    /** @type {Element}        */ arrowContainer;
    /** @type {HTMLDivElement} */ hostTilesContainer;
    /** @type {HTMLDivElement} */ guestTilesContainer;

    /**
     * @param {HTMLDivElement} gameContainer
     * @param {boolean} isMovile
     * @param {boolean} enableAnimation
     */
    constructor(gameContainer, isMovile, enableAnimation) {
        this.gameContainer = gameContainer;
        this.isMobile = isMovile;
        this.animationOn = enableAnimation;

        // NOTE: This function is imported from ../ActuatorHelp.js
        let containers = setupPaiShoBoard(
            this.gameContainer,
            GodaiController.getHostTilesContainerDivs(),
            GodaiController.getGuestTilesContainerDivs(),
            false
        );

        this.boardContainer = containers.boardContainer;
        this.arrowContainer = containers.arrowContainer;
        this.hostTilesContainer = containers.hostTilesContainer;
        this.guestTilesContainer = containers.guestTilesContainer;
    }

    setAnimationOn(isOn) {
        this.animationOn = isOn;
    }

    /**
     * Calls forth `this.htmlify()`
     *
     * NOTE: This is function is the key for updating your board state, so you should never call `this.htmlify()` directly
     * @param {GodaiBoard} board
     * @param {GodaiTileManager} tileManager
     * @param {PaiShoMarkingManager} markingManager
     * @param {*} moveToAnimate
     * @param {number} moveAnimationBeginStep
     */
    actuate(
        board,
        tileManager,
        markingManager,
        moveToAnimate,
        moveAnimationBeginStep
    ) {
        let self = this;
        if (!moveAnimationBeginStep) {
            moveAnimationBeginStep = 0;
        }

        window.requestAnimationFrame(function () {
            self.htmlify(board, tileManager, markingManager);
        });
    }

    /**
     * Creates the html grid found on the board
     *
     * @param {GodaiBoard} board
     * @param {GodaiTileManager} tileManager
     * @param {PaiShoMarkingManager} markingManager
     * @param {number} moveToAnimate
     * @param {number} moveAnimationBeginStep
     */
    htmlify(
        board,
        tileManager,
        markingManager,
        moveToAnimate,
        moveAnimationBeginStep
    ) {
        this.clearContainer(this.boardContainer);
        this.clearContainer(this.arrowContainer);

        for (const column of board.cells) {
            for (const cell of column) {
                if (
                    markingManager.pointIsMarked(cell) &&
                    !cell.isType(MARKED)
                ) {
                    cell.addType(MARKED);
                } else if (
                    !markingManager.pointIsMarked(cell) &&
                    cell.isType(MARKED)
                ) {
                    cell.removeType(MARKED);
                }

                if (cell) {
                    this.addBoardPoint(cell);
                }
            }
        }

        // Draw arrows
        for (let [_, arrow] of Object.entries(markingManager.arrows)) {
            this.arrowContainer.appendChild(
                createBoardArrow(arrow[0], arrow[1])
            );
        }

        let fullTileSet = new GodaiTileManager();

        // Go through tile piles and clear containers
        for (const tile of fullTileSet.hostTiles) {
            this.clearTileContainer(tile);
        }
        for (const tile of fullTileSet.guestTiles) {
            this.clearTileContainer(tile);
        }
        // Don't forget the deleted tiles!
        this.clearContainer(
            this.hostTilesContainer.querySelector("span.tileLibrary")
        );
        this.clearContainer(
            this.guestTilesContainer.querySelector("span.tileLibrary")
        );

        // Go through tile piles and display
        for (const tile of tileManager.hostTiles) {
            this.addTile(tile, this.hostTilesContainer);
        }
        for (const tile of tileManager.guestTiles) {
            this.addTile(tile, this.guestTilesContainer);
        }

        // Add deleted tiles
        for (const capturedTile of tileManager.capturedHostTiles) {
            this._addCapturedTile(capturedTile, this.hostTilesContainer);
        }
        for (const capturedTile of tileManager.capturedGuestTiles) {
            this._addCapturedTile(capturedTile, this.guestTilesContainer);
        }
    }

    /** @param {Element} container */
    clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }

    /**
     * Taken from CaptureActuator.js
     *
     * Remember to add the correct div with its proper tile code in
     * `Controller.getHostTilesContainerDivs()` / `Controller.getGuestTilesContainerDivs()` or else this breaks
     * @param {GodaiTile} tile
     */
    clearTileContainer(tile) {
        let containerClass = "." + tile.getImageName();
        let container = document.querySelector(containerClass);
        while (container.firstChild != null) {
            container.removeChild(container.firstChild);
        }
    }

    /**
     * Taken from CaptureActuator.js
     * @param {GodaiTile} tile
     * @param {HTMLDivElement} mainContainer Seems to be unused, but I'll keep it just in case :)
     */
    addTile(tile, mainContainer) {
        let container = mainContainer.querySelector("." + tile.getImageName());
        let div = document.createElement("div");

        div.classList.add("point");
        div.classList.add("hasTile");

        if (tile.selectedFromPile) {
            div.classList.add("selectedFromPile");
            div.classList.add("drained");
        }

        let img = document.createElement("img");
        let srcValue = this.getTileImageSourceDir();

        img.src = srcValue + tile.getImageName() + ".png";
        div.appendChild(img);

        div.setAttribute("name", tile.getImageName());
        div.setAttribute("id", tile.id);

        if (this.isMobile) {
            div.addEventListener("click", () => {
                unplayedTileClicked(div);
                showTileMessage(div);
            });
        } else {
            div.addEventListener("click", () => unplayedTileClicked(div));
            div.addEventListener("mouseover", () => showTileMessage(div));
            div.addEventListener("mouseout", clearMessage);
        }

        container.appendChild(div);
    }

    /**
     * Function of mine so to seperate concerns
     * @param {GodaiTile} tile
     * @param {HTMLDivElement} mainContainer Container of tiles.
     */
    _addCapturedTile(tile, mainContainer) {
        const capturedContainer =
            mainContainer.querySelector("span.tileLibrary");
        const div = document.createElement("div");

        div.classList.add("point");
        div.classList.add("hasTile");

        const img = document.createElement("img");
        const srcValue = this.getTileImageSourceDir();

        img.src = srcValue + tile.getImageName() + ".png";

        div.appendChild(img);

        div.setAttribute("name", tile.getImageName());
        div.setAttribute("id", tile.id);

        if (this.isMobile) {
            div.addEventListener("click", () => {
                showTileMessage(div);
            });
        } else {
            div.addEventListener("mouseover", () => showTileMessage(div));
            div.addEventListener("mouseout", clearMessage);
        }

        capturedContainer.appendChild(div);
    }

    /**
     * Taken from CaptureActuator.js
     * @param {GodaiBoardPoint} bp
     */
    addBoardPoint(bp) {
        let div = createBoardPointDiv(bp);

        if (!bp.isType(NON_PLAYABLE)) {
            div.classList.add("activePoint");

            if (bp.isType(MARKED)) {
                div.classList.add("markedPoint");
            }

            if (bp.isType(POSSIBLE_MOVE)) {
                div.classList.add("possibleMove");
            }

            if (this.isMobile) {
                div.setAttribute(
                    "ontouchstart",
                    "pointClicked(this); showPointMessage(this);"
                );
            } else {
                div.addEventListener("click", () => pointClicked(div));
                div.addEventListener("mouseover", () => showPointMessage(div));
                div.addEventListener("mouseout", clearMessage);
                div.addEventListener("mousedown", (e) => {
                    // Right Mouse Button
                    if (e.button == 2) {
                        RmbDown(div);
                    }
                });
                div.addEventListener("mouseup", (e) => {
                    // Right Mouse Button
                    if (e.button == 2) {
                        RmbUp(div);
                    }
                });
                div.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                });
            }
        }

        if (bp.hasTile()) {
            div.classList.add("hasTile");

            let img = document.createElement("img");
            let srcValue = this.getTileImageSourceDir();
            img.src = srcValue + bp.tile.getImageName() + ".png";

            div.appendChild(img);
        }

        this.boardContainer.appendChild(div);
    }

    // NOTE: Check out the other actuators for a better method than staticly adding the link to the images.
    getTileImageSourceDir() {
        return "./images/Godai/" + "original" + "/";
    }
}
```

{{% /tabs/tab %}}

{{% tabs/tab title="[Variant]GameManager.js" %}}

```js
export class GodaiGameManager {
    /** @type {string}               */ gameLogText;
    /** @type {boolean}              */ isCopy;
    /** @type {GodaiActuator}        */ actuator;
    /** @type {GodaiTileManager}     */ tileManager;
    /** @type {GodaiBoard}           */ board;
    /** @type {GodaiTileManager}     */ tileManager;
    /** @type {PaiShoMarkingManager} */ markingManager;
    /** @type {string}               */ lastPlayerName;

    constructor(actuator, ignoreActuate, isCopy) {
        this.gameLogText = "";
        this.isCopy = isCopy;
        this.actuator = actuator;

        this.tileManager = new GodaiTileManager();
        this.markingManager = new PaiShoMarkingManager();

        this.setup(ignoreActuate);
    }

    /** Set up the game */
    setup(ignoreActuate) {
        this.board = new GodaiBoard();

        if (!ignoreActuate) {
            this.actuate();
        }
    }

    /** @param {*} moveToAnimate */
    actuate(moveToAnimate) {
        if (this.isCopy) return;

        this.actuator.actuate(
            this.board,
            this.tileManager,
            this.markingManager,
            moveToAnimate
        );
        setGameLogText(this.gameLogText); // NOTE: This is imported from ../PaiShoMain.js
    }

    /**
     * @param {GodaiBoardPoint} boardPoint
     * @param {boolean} ignoreActuate
     */
    revealPossibleMovePoints(boardPoint, ignoreActuate) {
        if (!boardPoint.hasTile()) return;

        this.board.setPossibleMovePoints(boardPoint);

        if (!ignoreActuate) {
            this.actuate();
        }
    }

    revealDeployPoints(player, tileCode, ignoreActuate) {
        this.board.setDeployPointsPossibleMoves(player, tileCode);

        if (!ignoreActuate) {
            this.actuate();
        }
    }

    hidePossibleMovePoints(ignoreActuate) {
        this.board.removePossibleMovePoints();
        this.tileManager.removeSelectedTileFlags();
        if (!ignoreActuate) {
            this.actuate();
        }
    }

    cleanup() {}

    /**
     * NOTE: This method will be covered in another time
     * @param {GodaiNotationMove} move Move to play
     * */
    runNotationMove(move, withActuate) {}

    hasEnded() {
        return this.board.winners.length > 0;
    }

    getWinner() {
        if (this.board.winners.length === 1) {
            return this.board.winners[0];
        } else if (this.board.winners.length > 1) {
            return "BOTH players";
        }
    }

    getWinReason() {
        return this.board.winnerReason;
    }
}
```

{{% /tabs/tab %}}

{{% tabs/tab title="[Variant]Notation.js" %}}

```js
// NOTE: There are three classes here, they're all related so here's where they are all located

export class GodaiNotationMove {
    fullMoveText = "";
    isValid = false;

    /** @type {number} */
    moveNum = 0;
    playerCode = "";
    moveType = "";

    // MOVE information
    /** @type {NotationPoint} */ startPoint;
    /** @type {NotationPoint} */ endPoint;

    // DEPLOY information
    tileType = "";

    constructor(text) {
        this.fullMoveText = text;
        this.analyzeMove();
    }

    /**
     * Based on `this.fullMoveText`, decides if its a valid move notation or not
     *
     * NOTE: This method will be covered in a later post
     */
    analyzeMove() {}

    isValidNotation() {
        return this.isValid;
    }
}

export class GodaiGameNotation {
    /** @type {string} */
    notationText = "";

    /** @type {Array<GodaiNotationMove>} */
    moves = [];

    /** @param {string} text */
    setNotationText(text) {
        this.notationText = text;
        this.loadMoves();
    }

    /** @param {string} text */
    addNotationLine(text) {
        this.notationText += ";" + text.trim();
        this.loadMoves();
    }

    /** @param {GodaiNotationMove} move  */
    addMove(move) {
        if (this.notationText) {
            this.notationText += ";" + move.fullMoveText;
        } else {
            this.notationText = move.fullMoveText;
        }

        this.loadMoves();
    }

    removeLastMove() {
        this.notationText = this.notationText.substring(
            0,
            this.notationText.lastIndexOf(";")
        );
        this.loadMoves();
    }

    getPlayerMoveNum() {
        let moveNum = 1;
        let lastMove = this.moves[this.moves.length - 1];

        if (lastMove) {
            moveNum = lastMove.moveNum;
            if (lastMove.playerCode == GUEST) {
                moveNum++;
            }
        }

        return moveNum;
    }

    /**
     * NOTE: If your game starts with HOST may want to modify this method accordingly,
     * look at the other GameNotations from variants that start with host
     * @param {GodaiNotationBuilder} builder
     * @returns {GodaiNotationMove}
     */
    getNotationMoveFromBuilder(builder) {
        let moveNum = 1;
        let player = GUEST;
        let lastMove = this.moves[this.moves.length - 1];

        if (lastMove) {
            moveNum = lastMove.moveNum;

            if (lastMove.moveNum === 0 && lastMove.playerCode === HOST) {
                player = GUEST;
            } else if (
                lastMove.moveNum === 0 &&
                lastMove.playerCode === GUEST
            ) {
                moveNum++;
                player = GUEST;
            } else if (lastMove.playerCode === HOST) {
                moveNum++;
            } else {
                player = HOST;
            }
        }

        return builder.getNotationMove(moveNum, player);
    }

    /**
     * For each move split from `this.notationText`, analyze each one of them and add them to `this.moves`
     * if they're valid
     */
    loadMoves() {
        this.moves = [];
        let lines = [];
        if (this.notationText) {
            if (this.notationText.includes(";")) {
                lines = this.notationText.split(";");
            } else {
                lines = [this.notationText];
            }
        }

        let lastPlayer = HOST; // Lets say the host started the game
        for (const line of lines) {
            let move = new GodaiNotationMove(line);
            if (move.isValidNotation() && move.playerCode !== lastPlayer) {
                this.moves.push(move);
                lastPlayer = move.player;
            } else {
                debug("the player check is broken?");
            }
        }
    }

    /* GETTERS FOR TEXT */

    getNotationHtml() {
        let lines = [];
        if (this.notationText) {
            if (this.notationText.includes(";")) {
                lines = this.notationText.split(";");
            } else {
                lines = [this.notationText];
            }
        }

        let notationHTML = lines.reduce(
            (acc, line) => (acc += line + "<br />"),
            ""
        );
        return notationHTML;
    }

    notationTextForUrl() {
        return this.notationText;
    }

    getNotationForEmail() {
        let lines = [];
        if (this.notationText) {
            if (this.notationText.includes(";")) {
                lines = this.notationText.split(";");
            } else {
                lines = [this.notationText];
            }
        }

        let notationHTML = lines.reduce(
            (acc, line) => (acc += line + "[BR]"),
            ""
        );
        return notationHTML;
    }

    getLastMoveText() {
        return this.moves[this.moves.length - 1].fullMoveText;
    }

    getLastMoveNumber() {
        return this.moves[this.moves.length - 1].moveNum;
    }
}

export class GodaiNotationBuilder {
    status = BRAND_NEW;

    moveType = "";
    plantedlowerType = "";

    // NOTE: These are imported from ..CommonNotationObjects along with the HOST and GUEST keywords
    /** @type {NotationPoint} */ startPoint;
    /** @type {NotationPoint} */ endPoint;

    /**
     *
     * Taken from CaptureGameNotation.js
     * @param {number} moveNum
     * @param {string} player
     * @returns {GodaiNotationMove}
     */
    getNotationMove(moveNum, player) {
        let notationLine = moveNum + player.charAt(0) + ".";

        if (this.moveType === MOVE) {
            notationLine += `(${this.startPoint.pointText})-(${this.endPoint.pointText})`;
        } else if (this.moveType === DEPLOY) {
            notationLine += `${this.tileType}(${this.endPoint.pointText})`;
        }

        return new GodaiNotationMove(notationLine);
    }
}
```

{{% /tabs/tab %}}

{{% tabs/tab title="[Variant]Board.js" %}}

Mind you, this class will get even bigger by the end of this, _you've been warned._

```js
export class GodaiBoard {
    /** @type {RowAndColumn} */ size;
    /** @type {Array<Array<GodaiBoardPoint>>} */ cells;
    /** @type {Array<string>} */ winners;
    /** @type {string} */ winnerReason = "";

    constructor() {
        // NOTE: If your variant is played on intersections, then keep the size as it is.
        // If it is instead played in spaces like in Adevar, then change it to 18x18
        this.size = new RowAndColumn(17, 17);
        this.cells = this.brandNew();
        this.winners = [];
    }

    // NOTE: The whole reason this class is so bloated and is around 600 lines long
    brandNew() {}

    /**
     * Taken from SpiritBoard.js
     * @param {number} numColumns Number of Columns to add. They're added from the center
     * @param {Array<GodaiBoardPoint>} points points to add, from left to right
     * @returns {Array<GodaiBoardPoint>}
     */
    newRow(numColumns, points) {
        let cells = [];
        let numBlanksOnSides = (this.size.row - numColumns) / 2;

        let nonPoint = new GodaiBoardPoint();
        nonPoint.addType(NON_PLAYABLE);

        for (var i = 0; i < this.size.row; i++) {
            if (i < numBlanksOnSides) {
                cells[i] = nonPoint;
            } else if (i < numBlanksOnSides + numColumns) {
                if (points) {
                    cells[i] = points[i - numBlanksOnSides];
                } else {
                    cells[i] = nonPoint;
                }
            } else {
                cells[i] = nonPoint;
            }
        }

        return cells;
    }

    /**
     * Taken from VagabondBoard.js
     * @param {GodaiBoardPoint} bpStart
     * @param {GodaiBoardPoint} bpEnd
     * @param {number} numMoves
     */
    _verifyAbleToReach(bpStart, bpEnd, numMoves) {
        // Recursion!
        return this._pathFound(bpStart, bpEnd, numMoves, bpStart);
    }

    /**
     * Taken from VagabondBoard.js
     *
     * NOTE: This method, along with others that were made exclusively for this one,
     * are the *second* reason why this class is so bloated
     * @param {GodaiBoardPoint} bpStart
     * @param {GodaiBoardPoint} bpEnd
     * @param {number} numMoves
     */
    _pathFound(bpStart, bpEnd, numMoves) {}

    /**
     * @param {string} playerCode GUEST or HOST
     * @param {NotationPoint} notationPointStart
     * @param {NotationPoint} notationPointEnd
     */
    moveTile(playerCode, notationPointStart, notationPointEnd) {}

    /**
     * Taken from VagabondBoard.js
     * @param {GodaiBoardPoint} boardPointStart
     */
    setPossibleMovePoints(boardPointStart) {}

    /**
     * @param {string} player HOST or GUEST
     * @param {string} tileCode
     * @returns
     */
    setDeployPointsPossibleMoves(player, tileCode) {}

    removePossibleMovePoints() {
        this.cells.forEach((row) => {
            row.forEach((bp) => bp.removeType(POSSIBLE_MOVE));
        });
    }

    /**
     *
     * @param {GodaiTile} tile
     * @param {NotationPoint} notationPoint
     */
    placeTile(tile, notationPoint) {
        this.putTileOnPoint(tile, notationPoint);

        // Things to do after a tile is placed

        // Nothing :)
    }

    putTileOnPoint(tile, notationPoint) {
        let p = notationPoint.rowAndColumn;
        let point = this.cells[p.row][p.col];
        point.putTile(tile);
    }

    /**
     * Checks whether a player has won, and adds it as a winner and the reason why.
     * @param {GodaiTileManager} tileManager Contains all the tiles neccesary to check if a player has won
     */
    checkForEndGame(tileManager) {}

    /**
     * NOTE: This methods will be useful when calculating possible moves,
     * be sure to look at the boards to see any other methods used for unortodox movements!
     * @param {RowAndColumn} rowAndCol
     * @returns {Array<RowAndColumn>}
     */
    getSurroundingBoardPoints(initialBoardPoint) {
        var surroundingPoints = [];
        for (
            var row = initialBoardPoint.row - 1;
            row <= initialBoardPoint.row + 1;
            row++
        ) {
            for (
                var col = initialBoardPoint.col - 1;
                col <= initialBoardPoint.col + 1;
                col++
            ) {
                if (
                    (row !== initialBoardPoint.row ||
                        col !== initialBoardPoint.col) && // Not the center given point
                    row >= 0 &&
                    col >= 0 &&
                    row < 17 &&
                    col < 17
                ) {
                    // Not outside range of the grid
                    var boardPoint = this.cells[row][col];
                    if (!boardPoint.isType(NON_PLAYABLE)) {
                        // Not non-playable
                        surroundingPoints.push(boardPoint);
                    }
                }
            }
        }
        return surroundingPoints;
    }

    getTilesOnBoard() {
        let tiles = [];

        for (const row of this.cells) {
            for (const bp of row) {
                if (!bp.isType(NON_PLAYABLE) && bp.hasTile()) {
                    tiles.push(bp.tile);
                }
            }
        }

        return tiles;
    }
}
```

{{% /tabs/tab %}}

{{% tabs/tab title="[Variant]BoardPoint.js" %}}

```js
// NOTE: You will export your board point types from here

export class GodaiBoardPoint {
    /** @type {Array<string>} */ types;
    /** @type {number}        */ row;
    /** @type {number}        */ col;
    /** @type {GodaiTile}     */ tile;

    constructor() {
        this.types = [];
        this.row = -1;
        this.col = -1;
    }

    /**
     * Taken from SpiritBoardPoint.js
     * @param {string} type Type of point. Use constants only.
     */
    addType(type) {
        if (!this.types.includes(type)) {
            this.types.push(type);
        }
    }

    /**
     * Taken from SpiritBoardPoint.js
     * @param {string} type Type of point. Use constants only.
     */
    removeType(type) {
        for (let i = 0; i < this.types.length; i++) {
            if (this.types[i] === type) {
                this.types.splice(i, 1);
            }
        }
    }

    /**
     * Taken from SpiritBoardPoint.js
     * @param {GodaiTile} tile
     */
    putTile(tile) {
        this.tile = tile;
    }

    removeTile() {
        let tile = this.tile;
        this.tile = null;
        return tile;
    }

    /**
     * Taken from SpiritBoardPoint.js
     */
    hasTile() {
        if (this.tile) return true;
        return false;
    }

    isType(type) {
        return this.types.includes(type);
    }

    /* POINT TYPES */

    // NOTE: Here you will place all your board point types as static constructors. I'll leave you with two examples:

    static neutral() {
        let point = new GodaiBoardPoint();
        point.addType(NEUTRAL);
        return point;
    }

    static gate() {
        let point = new GodaiBoardPoint();
        point.addType(GATE);
        return point;
    }
}
```

{{% /tabs/tab %}}

{{< /tabs/wrapper >}}

## There's a board on your lawn
