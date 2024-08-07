const { getConfig } = require("../utils") 

class Player {
    constructor(username, color, money) {
        const { tiles } = getConfig("tiles.json")

        this.disable = false
        this.username = username
        this.color = color
        this.money = money
        this.own = []
        this.releasePrison = 0
        this.arrested = 0

        this.service = {
            offer: null,
            rent: null,
            deal: null,
            tax: null,
            card: null,
        }

        this.monopoly = {}
        for (const tile of tiles) {
            if (!this._canBuy(tile)) continue
            this.monopoly[this._getKey(tile)] = 0
        }
    }

    _canBuy(tile) {
        const type = tile.type
        return ["standard", "communal", "station"].indexOf(type) != -1
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
        tile.resetBuilding()
    }

    transfer(tile, receivingPlayer) {
        this.removeOwn(tile)
        receivingPlayer.addOwn(tile)
    }

    setService(setting, val) {
        this.service[setting] = val
    }

    clearService(setting) {
        this.service[setting] = null
    }

    resetServices() {
        for (const setting in this.service) {
            this.service[setting] = null
        }
    }
}

module.exports = Player
