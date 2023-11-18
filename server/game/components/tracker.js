class Tracker {
    constructor(countPlayers) {
        this.current = null
        this.order = []

        this.countPlayers = countPlayers
        this.valuesDices = {}
    }

    setOrder(username, value) {
        const valuesDices = this.valuesDices
        valuesDices[username] = value
        const players = Object.keys(valuesDices)
        if (players.length == this.countPlayers) {
            this.order = players.sort((a, b) => valuesDices[b] - valuesDices[a])
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
