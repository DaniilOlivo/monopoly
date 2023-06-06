const { settings, getConfig } = require("./utils") 

const COLORS = settings["colors"]


class Game {
    constructor(usernames) {
        this.stage = "start"
        this.players = {}

        for (let i = 0; i < usernames.length; i++) {
            let username = usernames[i]
            this.players[username] = {
                color: COLORS[i],
                money: settings["startMoney"]
            }
        }

        this.moves = {
            current: null,
            order: [],
            valuesDices: {}
        }

        let {price_building, tiles} = getConfig("tiles.json")

        // Check valid json
        const REQUIRE_TILES = 40
        if (tiles.length != REQUIRE_TILES) throw new Error("Tiles are not 40. JSON is incorrect")

        // Generating an id for cells where it is not explicitly specified
        // A certain parameter (color or type) is taken and a number is added to it
        // This applies to the same type of cells that do not have a special uniqueness
        let countIdTable = {}
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
            if (tile.id === "start") tile.players = Object.keys(this.players)
        }

        this.tiles = tiles

        this.dices = [4, 2]
    }

    setOrderPlayer(username, value) {
        const valuesDices = this.moves.valuesDices
        valuesDices[username] = value
        const players = Object.keys(valuesDices)
        if (players.length == Object.keys(this.players).length) {
            this.moves.order = players.sort((a, b) => {
                return valuesDices[a] - valuesDices[b]
            })
            this.moves.current = this.moves.order[0]
            this.stage = "main"
        }

        return this
    }

    moveField(username, value) {
        const getNewIndex = (currentIndex, addedValue) => {
            let newIndex = currentIndex + addedValue
            if (newIndex == 40) newIndex = 0
            if (newIndex > 40) {
                let remains = newIndex - 40
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
                indexTile = getNewIndex(i, value)
                if (i > indexTile) this.players[username].money += 200
                break
            }
        }

        if (indexTile == -1) return

        const newTile = this.tiles[indexTile]
        newTile.players.push(username)
    }

    nextMovePlayer() {
        const moves = this.moves
        const indexPlayer = moves.order.indexOf(moves.current)
        const lenPlayers = moves.order.length

        let newIndexPlayer = indexPlayer + 1
        if (lenPlayers == newIndexPlayer) newIndexPlayer = 0

        moves.current = moves.order[newIndexPlayer]
    }

    rollDices(dices) {
        this.dices = dices
        const [val1, val2] = dices 
        this.moveField(this.moves.current, val1 + val2)
        if (val1 != val2) this.nextMovePlayer()
    }
}

module.exports = Game
