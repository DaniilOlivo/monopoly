class Tracker {
    constructor(countPlayers) {
        this.current = null
        this.order = []

        this.countPlayers = countPlayers
        this.valuesDices = {}
    }

    setOrder(username, dices) {
        const valuesDices = this.valuesDices
        valuesDices[username] = dices
        const players = Object.keys(valuesDices)
        if (players.length == this.countPlayers) {
            const sum = (arr) => arr.reduce((s, a) => s + a, 0)
            this.order = players.sort((a, b) => sum(valuesDices[b]) - sum(valuesDices[a]))
            this.current = this.order[0]
            return true
        }

        return false
    }

    next() {
        const indexPlayer = this.order.indexOf(this.current)

        let newIndexPlayer = indexPlayer + 1
        if (this.countPlayers == newIndexPlayer) newIndexPlayer = 0

        this.current = this.order[newIndexPlayer]

        return this.current
    }
}

module.exports = Tracker
