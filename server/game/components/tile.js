const { getConfig } = require("../utils")

class Tile {
    constructor(tileConfig) {
        const {colorsSettings, desc, stationsRent} = getConfig("tiles.json")

        Object.assign(this, tileConfig)
        const type = tileConfig.type
        if (type == "standard") {
            const {price, count} = colorsSettings[tileConfig.color]
            this.priceBuilding = price
            this.count = count
            this.building = 0
            this.hotel = false
        }
        if (type == "communal") this.desc = desc.communal
        if (type == "station") this.rent = stationsRent
        if (type == "chance") this.title = "Chance"
        if (type == "community_chest") this.title = "Community chest"

        this.players = []
        this.owner = null
        this.pledge = false
        this.canBuy = false

        if (["standard", "communal", "station"].indexOf(type) != -1) this.canBuy = true
    }

    playerIn(username) {
        return this.players.indexOf(username) != -1
    }

    addBuilding() {
        if (this.hotel) return
        this.building++
        if (this.building == 5) this.hotel = true
    }

    removeBuilding() {
        if (this.building == 0) return
        this.building--
        this.hotel = false
    }
}

module.exports = Tile
