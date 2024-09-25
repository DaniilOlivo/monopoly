const { getConfig, getConfigLang } = require("../utils")

class Tile {
    constructor(tileConfig, lang) {
        const { areaDetail } = getConfig("tiles.json")
        const { tiles, desc } = getConfigLang(lang)

        Object.assign(this, tileConfig)
        const type = tileConfig.type
        if (type == "standard") {
            const {priceBuilding, numberTiles} = areaDetail[tileConfig.color]
            this.priceBuilding = priceBuilding
            this.numberTilesArea = numberTiles
            this.building = 0
            this.hotel = false
        }
        if (type == "communal") this.desc = desc.communal
        
        let key = this.id
        if (this.type == "community_chest") key = "community_chest"
        if (this.type == "chance") key = "chance"
        this.title = tiles[key]

        this.players = []
        this.owner = null
        this.pledge = false
        this.canBuy = false

        if (["standard", "communal", "station"].indexOf(type) != -1) this.canBuy = true
    }

    addPlayer(username) {
        if (this.playerIn(username)) return false
        this.players.push(username)
        return true
    }

    removePlayer(username) {
        if (!this.playerIn(username)) return false
        this.players.splice(this.players.indexOf(username), 1)
        return true
    } 

    playerIn(username) {
        return this.players.indexOf(username) != -1
    }

    addBuilding() {
        if (this.hotel) return false
        this.building++
        if (this.building == 5) this.hotel = true
        return true
    }

    removeBuilding() {
        if (this.building == 0) return false
        this.building--
        this.hotel = false
        return true
    }

    resetBuilding() {
        this.building = 0
        this.hotel = false
        this.pledge = false
    }
}

module.exports = Tile
