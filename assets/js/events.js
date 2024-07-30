// Get all those js events going
window.addEventListener("load", () => {
    document.querySelectorAll(".image-holder")
    .forEach( imageSwapper )
} )

/**
 * 
 * @param {HTMLDivElement} element 
 */
function imageSwapper(element) {
    const images = element.querySelectorAll("img")
    let counter = 0
    let visibleImage = 0
    const INTERVAL_TIMER_MS = 1000

    setInterval(() => {
        counter++
        visibleImage = counter % images.length

        images.forEach( (img, i) => {
            if ( visibleImage == i ) {
                img.classList.add("visible")
            }
            else {
                img.classList.add("invisible")
                img.classList.remove("visible")
            }
        })
    }, INTERVAL_TIMER_MS)
}