const { getConfig } = require("../utils")

const COUNT_TILES = 40

class Field {
    constructor(listPlayers) {
        const {price_building, tiles, desc, stationsRent} = getConfig("tiles.json")
        // Check valid json
        if (tiles.length != COUNT_TILES) throw new Error("Tiles are not 40. JSON is incorrect")

        // Generating an id for cells where it is not explicitly specified
        // A certain parameter (color or type) is taken and a number is added to it
        // This applies to the same type of cells that do not have a special uniqueness
        const countIdTable = {}
        const genId = (tile, parameter) => {
            let currentParameter = tile[parameter]
            let id = 1
            let countId = countIdTable[currentParameter]
            if (countId) id = countId
            else countIdTable[currentParameter] = id
            countIdTable[currentParameter]++
            tile.id = currentParameter + '_' + id
        }

        for (const tile of tiles) {
            let type = tile.type
            if (!tile.id) {
                if (type == "standard") genId(tile, "color")
                else genId(tile, "type")
            }

            if (type == "standard") tile.price_building = price_building[tile.color]
            if (type == "communal") tile.desc = desc.communal
            if (type == "station") tile.rent = stationsRent

            tile.players = []
            if (tile.id === "start") Object.assign(tile.players, listPlayers)

        }

        this.tiles = tiles
    }

    findPlayer(username) {
        const tile = this.tiles.find((tile) => tile.players.indexOf(username) != -1)
        const index = this.tiles.indexOf(tile)

        return [tile, index]
    }

    replacePlayer(username, newIndex) {
        // -1 in the new index indicates deletion
        if (newIndex < -1 || newIndex >= COUNT_TILES) return false
        const [tile] = this.findPlayer(username)
        const indexPlayer = tile.players.indexOf(username)
        tile.players.splice(indexPlayer, 1)
        if (newIndex != -1) {
            this.tiles[newIndex].players.push(username)
        }
        return true
    }

    move(username, countSteps) {
        let newCircleBool = false

        const getNewIndex = (currentIndex, addedValue) => {
            let newIndex = currentIndex + addedValue
            if (newIndex == COUNT_TILES) newIndex = 0
            if (newIndex > COUNT_TILES) {
                let remains = newIndex - COUNT_TILES
                newIndex = getNewIndex(0, remains)
            }
            return newIndex
        }

        const [tile, index] = this.findPlayer(username)
        if (!tile) return [false, newCircleBool]

        const newIndex = getNewIndex(index, countSteps)
        
        if (index > newIndex) newCircleBool = true

        const result = this.replacePlayer(username, newIndex)

        return [result, newCircleBool]
    }
}

module.exports = Field
