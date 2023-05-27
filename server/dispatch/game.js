const roomManager = require("../rooms")

function startGame(roomTilte) {
    const room = roomManager.rooms[roomTilte]
    const game = room.startGame()
    room.broadcast("game_init")
    room.broadcast("game_update", {game})
}

function setOrderPlayer(socket, valueDice) {
    const { find, username, room }  = roomManager.findWs(socket)
    if (!find) return

    const game = room.game.setOrderPlayer(username, valueDice)
    room.broadcast("game_update", {game})
}

function dispatch(socket, event, options) {
    if (event == "start_game") startGame(options.roomTilte)
    if (event == "set_order_player") setOrderPlayer(socket, options.valueDice)
}

module.exports = dispatch
