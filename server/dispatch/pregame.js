const roomManager = require("../rooms")

function register(ws, username, titleRoom) {
    let room = roomManager.rooms[titleRoom]
    let [result, info] = room.addPlayer(username, ws)
    ws.sendMessage("confirm_login", {confirm: result, info})
    if (result) {
        let players = room.getPlayers()
        let host = room.host
        room.broadcast("data_room", {players, host})
    }
}

function dispatch(socket, event, options) {
    if (event == "register") register(socket, options.username, options.titleRoom)
}

module.exports = dispatch
