const { settings, getConfig } = require("./utils") 

const MAX_PLAYERS = 8
const COLORS = settings["colors"]

function initState(usernames) {
    let players = {}

    for (let i = 0; i < players.length; i++) {
        let username = usernames[i]
        players[username] = {
            color: COLORS[i],
            money: settings["startMoney"]
        }
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

        if (type == "standard") {
            tile.price_building = price_building[tile.color]
        }
    }

    return {
        players,
        orderMoves: [],
        tiles
    }
}

const gamesStates = {}

function initGame(titleRoom, usernames) {
    gamesStates[titleRoom] = initState(usernames)
}

module.exports = { gamesStates, initGame }
