const { getConfig } = require("../utils")

const COUNT_TILES = 40

class Field {
    constructor(listPlayers) {
        let {price_building, tiles} = getConfig("tiles.json")
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
            if (countId) {
                id = countId
                countIdTable[currentParameter]++
            } else countIdTable[currentParameter] = id
            tile.id = currentParameter + '_' + id
        }

        for (const tile of tiles) {
            let type = tile.type
            if (!tile.id) {
                if (type == "standard") genId(tile, "color")
                else genId(tile, "type")
            }

            if (type == "standard") tile.price_building = price_building[tile.color]

            tile.players = []
            if (tile.id === "start") tile.players = listPlayers

        }

        this.tiles = tiles
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

        let indexTile = -1
        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i]
            let flagFind = false
            for (const usernameTile of tile.players) {
                if (usernameTile == username) flagFind = true
            }

            if (flagFind) {
                let indexPlayer = tile.players.indexOf(username)
                tile.players.splice(indexPlayer, 1)
                indexTile = getNewIndex(i, countSteps)
                if (i > indexTile) newCircleBool = true
                break
            }
        }

        if (indexTile == -1) return [false, newCircleBool]

        const newTile = this.tiles[indexTile]
        newTile.players.push(username)

        return [true, newCircleBool]
    }
}

module.exports = Field
