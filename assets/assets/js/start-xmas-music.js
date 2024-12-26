const XMAS_IFRAME = document.createElement("iframe");
const XMAS_PREFIX = "https://www.youtube-nocookie.com/embed/"

/** @type {HTMLDivElement} */
const XMAS_CONTAINER = document.querySelector("#xmas-music")

function startBlastingMusic() {
    XMAS_IFRAME.setAttribute("src", "");
	XMAS_IFRAME.setAttribute("frameborder", "0");
	XMAS_IFRAME.setAttribute("allow", "autoplay");

    let musicIDs = [
        "ObIH2jBhK6w", // Navidad con Luis Miguel
        "v6383pp5xGU", // Navidad cantemos todos - Valle del coral
    ]

    let selectedMusic = musicIDs[ Math.floor( Math.random() * musicIDs.length ) ]

    let videoSrc = XMAS_PREFIX + selectedMusic + "?enablejsapi=1&autoplay=1&controls=0&loop=1&disablekb=1"

    XMAS_IFRAME.setAttribute("src", videoSrc)

    XMAS_IFRAME.addEventListener("load", function () {
		// Turn up the volume
		this.contentWindow.postMessage(
			JSON.stringify({
				event: "command",
				func: "setVolume",
				args: [100],
			}),	"*"
		);
	})

    XMAS_CONTAINER.appendChild(XMAS_IFRAME)    
}

console.log("asasas")

window.addEventListener("load", () => startBlastingMusic())