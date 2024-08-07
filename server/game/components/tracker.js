class Tracker {
    constructor(countPlayers) {
        this.current = null
        this.order = []

        this.countPlayers = countPlayers
        this.valuesDices = {}
    }

    _setOrder() {
        const players = Object.keys(this.valuesDices)
        if (players.length == this.countPlayers) {
            const sum = (arr) => arr.reduce((s, a) => s + a, 0)
            this.order = players.sort((a, b) => sum(this.valuesDices[b]) - sum(this.valuesDices[a]))
            this.current = this.order[0]
            return true
        }

        return false
    }

    removePlayer(username) {
        this.countPlayers -= 1
        delete this.valuesDices[username]
        return this._setOrder()
    }

    setDiceValue(username, dices) {
        this.valuesDices[username] = dices
        return this._setOrder()
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
