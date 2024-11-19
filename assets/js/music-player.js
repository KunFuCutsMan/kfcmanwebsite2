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

	// Things we need to let the API know
	IFRAME.addEventListener("load", function () {
		// Turn up the volume
		this.contentWindow.postMessage(
			JSON.stringify({
				event: "command",
				func: "setVolume",
				args: [50],
			}),	"*"
		);

		// And send feedback on everything
		this.contentWindow.postMessage( JSON.stringify({ event: "listening" }), "*" )
	})

	BTN_PREV.addEventListener("click", () => handleNextPrev(-1) )
	BTN_NEXT.addEventListener("click", () => handleNextPrev(1) )
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

	switch (playerState) {
		case 0: // Video ended
			handleVideoEnd()
			break;
		case 1: // Video is playing
			BTN_PAUSE_PLAY.dataset.playing = true
			BTN_PAUSE_PLAY.ariaLabel = "Pause Video"
			break
		case 2: // Video is paused
			BTN_PAUSE_PLAY.dataset.playing = false
			BTN_PAUSE_PLAY.ariaLabel = "Play Video"
			break
	
		default:
			break;
	}
}

/**
 * @param {boolean} autoplay If set to `false` then the song won't play once loaded
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
 * @param {number} offset Go to the next or previous selection, must be +1, 0, -1
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

function chooseRandomSong() {
	let optionsLength = SELECT_SONG.length
	
	SELECT_SONG.selectedIndex = Math.round( Math.random() * optionsLength )
	changeMusic()
}

function handleNextPrev( offset ) {
	if (SELECT_PLAYING_MODE.value == "RANDOM") {
		chooseRandomSong()
		return
	}

	changeSelectionTo(offset)
}

function pauseOrPlay() {
	let event = {
		event: "command",
		func: "pauseVideo"
	}

	if ( BTN_PAUSE_PLAY.dataset.playing == "true" ) {
		event.func = "pauseVideo"
		BTN_PAUSE_PLAY.dataset.playing = false
		BTN_PAUSE_PLAY.ariaLabel = "Play Video"
	}
	else {
		event.func = "playVideo"
		BTN_PAUSE_PLAY.dataset.playing = true
		BTN_PAUSE_PLAY.ariaLabel = "Pause Video"
	}

	IFRAME.contentWindow.postMessage(JSON.stringify(event), "*")
}

function handleVideoEnd() {
	const playingMode = SELECT_PLAYING_MODE.value

	switch (playingMode) {
		case "PLAYLIST":
			// Go to the next song
			changeSelectionTo(1)
			break;
		case "LOOP":
			// Repeat it
			changeSelectionTo(0)
			break
		case "RANDOM":
			chooseRandomSong()
			// Choose a random song
	}
}

createYouTubePlayer();