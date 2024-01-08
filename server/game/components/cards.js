const { settings } = require("../utils")

const COUNT_CARDS = settings["countCards"]

class Cards {
    constructor(arrCardsSource) {
        const len = arrCardsSource.length
        this.list = []

        let count = 0
        for (let i = 0; i < COUNT_CARDS; i++) {
            this.list.push(Object.assign({}, arrCardsSource[count]))
            count++
            if (count == len) count = 0
        }

        this.shuffle()
        this.count = 0
    }

    shuffle() {
        let len = this.list.length

        while (len) {
            let i = Math.floor(Math.random() * len--)

            let el = this.list[len]
            this.list[len] = this.list[i]
            this.list[i] = el
        }
    }

    get() {
        const card = this.list[this.count++]
        if (this.count == COUNT_CARDS) {
            this.count = 0
            this.shuffle()
        }
        return card
    }
}

module.exports = Cards
