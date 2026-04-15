/* Somewhere else JS */

class CanvasHandler {

    constructor() {
        /** @type {HTMLCanvasElement} */
        this.canvas = document.getElementById('canvas')
        /** @type {CanvasRenderingContext2D} */
        this.context = this.canvas.getContext("2d")
    }

    get canvasPX() {
        return this.canvas.width / this.canvas.offsetWidth
    }

    /**
     * 
     * @param {HTMLElement} element
     */
    moveLineToElement(element) {
        const centerX = element.offsetLeft * this.canvasPX
        const centerY = element.offsetTop * this.canvasPX
        const offset = element.offsetWidth * this.canvasPX / 2

        this.clear()

        this.context.beginPath()
        this.context.fillStyle = "red"
        this.context.arc(centerX + offset, centerY + offset, offset / this.canvasPX, 0, 2 * Math.PI)
        this.context.fill()
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
}

let handler = new CanvasHandler()

window.addEventListener('load', function () {
    let boxes = "";
    for (let i = 0; i < 200; i++) {
        const color = Math.random() < 0.4 ? "cyan" : "white"
        const x = Math.round(Math.random() * 99) + 1
        const y = Math.round(i * 1) + (i * 2 % 5) + 1
        const diffusion = Math.round() < 0.5 ? "3px" : "2px"
        boxes += `${x}vw ${y}vh ${diffusion} ${color}`
        if (i < 199)
            boxes += ", "
    }
    document.querySelector(".stars").setAttribute("style", "box-shadow: " + boxes + ";")
})

window.addEventListener('mouseover', ev => {
    /** @type HTMLElement */
    const el = ev.target
    if (el.classList.contains("icon")) {
        handler.moveLineToElement(el)
    }
})