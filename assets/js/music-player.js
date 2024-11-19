// Got this from https://daniele63.com/javascript/music-player.js

// Also thank you so much to @mihauco for her insight
// https://medium.com/@mihauco/youtube-iframe-api-without-youtube-iframe-api-f0ac5fcf7c74

const IFRAME = document.createElement("iframe");
const VIDEO_PREFIX = "https://www.youtube-nocookie.com/embed/"

/** @type {HTMLSelectElement} */
const SELECT_SONG = document.querySelector("#select-song")
/** @type {HTMLDivElement} */
const CONTAINER = document.querySelector("#playlist-container")
/** @type {HTMLButtonElement} */
const BTN_PREV = document.querySelector("button#btn-prev")
/** @type {HTMLButtonElement} */
const BTN_PAUSE_PLAY = document.querySelector("button#btn-pause-play")
/** @type {HTMLButtonElement} */
const BTN_NEXT = document.querySelector("button#btn-next")
/** @type {HTMLSelectElement} */
const SELECT_PLAYING_MODE = document.querySelector("select#playing-mode")

// Create Music Player
function createYouTubePlayer() {
	IFRAME.setAttribute("src", "");
	IFRAME.setAttribute("frameborder", "0");
	IFRAME.setAttribute("allowfullscreen", "");
	IFRAME.setAttribute("id", "musicVideoPlayer");
	IFRAME.setAttribute("allow", "autoplay");
	
	// Change Music
	SELECT_SONG.addEventListener("change", e => {
		e.preventDefault()
		changeMusic()
	})

	changeMusic(false)

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

		this.contentWindow.postMessage(
			JSON.stringify({
				event: "listening"
			}),
			"*"
		)
	})

	BTN_PREV.addEventListener("click", () => changeSelectionTo(-1) )
	BTN_NEXT.addEventListener("click", () => changeSelectionTo(1) )
	BTN_PAUSE_PLAY.addEventListener("click", () => pauseOrPlay() )

	// Where it appears
	CONTAINER.prepend(IFRAME);
	return IFRAME;
}

window.addEventListener("message", (e) => {
	if ( e.origin.includes("youtube-nocookie.com") ) {
		let data = JSON.parse( e.data )
		if (data.event == "infoDelivery") {
			parseYoutubeData(data)
		}
	}
})

function parseYoutubeData(data) {
	const { playerState } = data.info
	if (playerState === 0) {
		handleVideoEnd()
	}
}

/**
 * @param {HTMLSelectElement} SELECT_SONG 
 * @param {HTMLIFrameElement} IFRAME 
 * @param {string} VIDEO_PREFIX 
 * @param {boolean} autoplay 
 */
function changeMusic(autoplay = true) {
	let videoSrc = VIDEO_PREFIX + SELECT_SONG.value + "?enablejsapi=1"

	if (autoplay) {
		videoSrc += "&autoplay=1"
	}

	const selectedChild = SELECT_SONG.selectedOptions.item(0)
	if (selectedChild.hasAttribute("data-start")) {
		const seconds = Number(selectedChild.dataset.start)
		videoSrc += "&start=" + seconds
	}

	IFRAME.setAttribute("src", videoSrc)
}

/**
 * @param {number} offset Go to the next or previous selection, must be +1 or -1
 */
function changeSelectionTo(offset) {
	let index = SELECT_SONG.selectedIndex
	let optionsLength = SELECT_SONG.length
	if (index + offset < 0) {
		SELECT_SONG.selectedIndex = optionsLength - 1
	}
	else if ( index + offset >= optionsLength ) {
		SELECT_SONG.selectedIndex = 0
	}
	else {
		SELECT_SONG.selectedIndex = index + offset
	}

	changeMusic()
}

function pauseOrPlay() {
	let event = {
		event: "command",
		func: "pauseVideo"
	}

	if ( BTN_PAUSE_PLAY.dataset.playing == "true" ) {
		event.func = "pauseVideo"
		BTN_PAUSE_PLAY.dataset.playing = false
		BTN_PAUSE_PLAY.textContent = "Pause"
	}
	else {
		event.func = "playVideo"
		BTN_PAUSE_PLAY.dataset.playing = true
		BTN_PAUSE_PLAY.textContent = "Play"
	}

	IFRAME.contentWindow.postMessage(
		JSON.stringify(event),
		"*"
	)
}

function handleVideoEnd() {
	console.log("Video Ended lol")
}

createYouTubePlayer();