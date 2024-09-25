const { getConfig } = require("../utils")
const Tile = require("./tile")

const COUNT_TILES = 40

class Field {
    constructor(listPlayers, lang) {
        const { tiles } = getConfig("tiles.json")

        // Check valid json
        if (tiles.length != COUNT_TILES) throw new Error("Tiles are not 40. JSON is incorrect")

        // Generating an id for cells where it is not explicitly specified
        // A certain parameter (color or type) is taken and a number is added to it
        // This applies to the same type of cells that do not have a special uniqueness
        const countIdTable = {}

        const genId = (tile) => {
            let currentParameter = tile.color ?? tile.type
            let id = 1
            let countId = countIdTable[currentParameter]
            if (countId) id = countId
            else countIdTable[currentParameter] = id
            countIdTable[currentParameter]++
            return currentParameter + '_' + id
        }

        this.tiles = []

        for (const tileConfig of tiles) {
            if (!tileConfig.id) tileConfig.id = genId(tileConfig)
            const tile = new Tile(tileConfig, lang)
            if (tile.id === "start") Object.assign(tile.players, listPlayers) 
            this.tiles.push(tile)
        }
    }

    getById(idTile) {
        const tile = this.tiles.find(tile => tile.id == idTile)
        if (!tile) throw new Error("No such tile with id " + idTile)
        return tile
    }

    findPlayer(username) {
        const tile = this.tiles.find(tile => tile.playerIn(username))
        if (!tile) throw new Error("No such player " + username)
        return tile
    }

    getIndexTile(tile) {
        return this.tiles.indexOf(tile)
    }

    replacePlayer(username, newIndex) {
        // -1 in the new index indicates deletion
        if (newIndex < -1 || newIndex >= COUNT_TILES) throw new Error("Invalid index " + newIndex)
        const tile = this.findPlayer(username)
        tile.removePlayer(username)
        if (newIndex != -1) {
            this.tiles[newIndex].addPlayer(username)
        }
    }

    move(username, countSteps) {
        let newLapBool = false

        const getNewIndex = (currentIndex, addedValue) => {
            let newIndex = currentIndex + addedValue
            if (newIndex == COUNT_TILES) newIndex = 0
            if (newIndex > COUNT_TILES) {
                let remains = newIndex - COUNT_TILES
                newIndex = getNewIndex(0, remains)
            }
            return newIndex
        }

        const tile = this.findPlayer(username)
        const index = this.getIndexTile(tile)

        const newIndex = getNewIndex(index, countSteps)
        
        if (index > newIndex) newLapBool = true

        this.replacePlayer(username, newIndex)

        return newLapBool
    }

    moveById(username, idTile) {
        const targetTile = this.getById(idTile)
        const indexTargetTile = this.getIndexTile(targetTile)

        const tilePlayer = this.findPlayer(username)
        const indexTilePlayer = this.getIndexTile(tilePlayer)
        
        this.replacePlayer(username, indexTargetTile)

        return indexTargetTile < indexTilePlayer
    }
}

module.exports = Field
