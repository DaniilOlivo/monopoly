const roomManager = require("../rooms")
const { initGame, gamesStates } = require("../game/state")

function startGame(roomTilte) {
    const room = roomManager.rooms[roomTilte]
    initGame(roomTilte, room.getPlayers())
    const game = gamesStates[roomTilte]
    room.broadcast("game_init")
    room.broadcast("game_update", {game})
}

function dispatch(socket, event, options) {
    if (event == "start_game") startGame(options.roomTilte)
}

module.exports = dispatch
