class Player {
    constructor(username, color, money, tiles) {
        this.username = username
        this.color = color
        this.money = money
        this.own = []
        this.service = {
            offer: null
        }

        this.monopoly = {}
        for (const tile of tiles) {
            if (!tile.canBuy) continue
            this.monopoly[this._getKey(tile)] = 0
        }
    }

    _getKey(tile) {
        return tile.color ?? tile.type
    }

    addOwn(tile) {
        tile.owner = this.username
        this.own.push(tile.id)
        this.monopoly[this._getKey(tile)] += 1
    }

    removeOwn(tile) {
        tile.owner = null
        this.own.splice(this.own.indexOf(tile.id), 1)
        this.monopoly[this._getKey(tile)] -= 1
    }

    setService(setting, val) {
        this.service[setting] = val
    }

    clearService(setting) {
        this.service[setting] = null
    }
}

module.exports = Player
