const roomManager = require("../rooms")
const { initGame, gamesStates } = require("../game/state")

function startGame(roomTilte) {
    const room = roomManager.rooms[roomTilte]
    initGame(roomTilte, room.getPlayers())
    const game = gamesStates[roomTilte]
    room.broadcast("game_init")
    room.broadcast("game_update", {game})
}

function setOrderPlayer(socket, valueDice) {
    const { find, username, room }  = roomManager.findWs(socket)
    if (!find) return
    const game = gamesStates[room.title]

    const objValuesPlayers = game.moves.valuesPlayers
    objValuesPlayers[username] = valueDice

    const entriesPlayers = Object.entries(objValuesPlayers)
    if (room.countPlayers == entriesPlayers.length) {
        game.moves.order = Object.keys(objValuesPlayers).sort(function (a, b) {
            return objValuesPlayers[a].pos - objValuesPlayers[b].pos;
        })

        game.moves.currentMove = game.moves.order[0]
        game.stage.current = "main"

        room.broadcast("game_update", {game})
    }
}

function dispatch(socket, event, options) {
    if (event == "start_game") startGame(options.roomTilte)
    if (event == "set_order_player") setOrderPlayer(socket, options.valueDice)
}

module.exports = dispatch
