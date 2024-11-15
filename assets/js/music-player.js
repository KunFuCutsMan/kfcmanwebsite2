// Got this from https://daniele63.com/javascript/music-player.js

// Create Music Player
function createYouTubePlayer() {
	const IFRAME = document.createElement("iframe");
	IFRAME.setAttribute("src", "");
	IFRAME.setAttribute("frameborder", "0");
	IFRAME.setAttribute("allowfullscreen", "");
	IFRAME.setAttribute("id", "musicVideoPlayer");
	IFRAME.setAttribute("allow", "autoplay");
	// Change Music
	const VIDEO_PREFIX = "https://www.youtube-nocookie.com/embed/";
	
	/** @type {HTMLSelectElement} */
	const SELECT_SONG = document.querySelector("#select-song")

	SELECT_SONG.addEventListener("change", e => {
		e.preventDefault()
		changeMusic( SELECT_SONG, IFRAME, VIDEO_PREFIX )
	})

	changeMusic( SELECT_SONG, IFRAME, VIDEO_PREFIX, false )

	// Set default volume
	IFRAME.addEventListener("load", function () {
		this.contentWindow.postMessage(
			JSON.stringify({
				event: "command",
				func: "setVolume",
				args: [50],
			}),
			"*"
		);
	})

	// Where it appears
	const CONTAINER = document.querySelector("#playlist-container");
	CONTAINER.prepend(IFRAME);
	return IFRAME;
}

/**
 * 
 * @param {HTMLSelectElement} SELECT_SONG 
 * @param {HTMLIFrameElement} IFRAME 
 * @param {string} VIDEO_PREFIX 
 * @param {boolean} autoplay 
 */
function changeMusic(SELECT_SONG, IFRAME, VIDEO_PREFIX, autoplay = true) {
	let videoSrc = VIDEO_PREFIX + SELECT_SONG.value + "?"

	if (autoplay) {
		videoSrc += "autoplay=1"
	}

	const selectedChild = SELECT_SONG.selectedOptions.item(0)
	if (selectedChild.hasAttribute("data-start")) {
		const seconds = Number(selectedChild.dataset.start)
		videoSrc += "&start=" + seconds
	}

	IFRAME.setAttribute("src", videoSrc)
}

createYouTubePlayer();