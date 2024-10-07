// Get all those js events going
window.addEventListener("load", () => {
    document.querySelectorAll(".image-holder")
    .forEach( imageSwapper )

    changeUpdateTime()
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


function changeUpdateTime( timeElement ) {
    fetch( LAST_MOD_URL, {
        method: 'GET',
        cache: "no-cache",
    })
    .then( r => r.text()
        .then( t => {
            let date = new Date(t)
            let day = new Date( date.getFullYear(), date.getMonth(), date.getDate() )
            /** @type {HTMLTimeElement} */
            let timeElement = document.querySelector("#last-updated")
            timeElement.dateTime = `${day.getFullYear()}-${day.getMonth()+1}-${day.getDate()}`
            timeElement.innerText = `${day.getDate()}/${day.getMonth()+1}/${day.getFullYear()}`
        } )
    )
}