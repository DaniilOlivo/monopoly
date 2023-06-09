const dispatchPregame = require("./dispatch/pregame")
const dispatchGame = require("./dispatch/game")

const roomManager = require("./rooms")

function removeWs(closedWs) {
    let result = roomManager.findWs(closedWs)

    if (result.find) {
        let { room, username } = result
        room.removePlayer(username)
        if (room.countPlayers == 0) roomManager.deleteRoom(room.title)
        else {
            let players = room.getPlayers()
            let host = room.host
            room.broadcast("data_room", {players, host})
        }
        return username
    } else return null
}


function handlerWs(ws, req) {
    console.log("Connect WS")

    ws.on('error', console.error)

    // Creating a wrapper for the socket to make it easier to work with it
    const socket = {
        proto: ws,
        sendMessage(event, options) {
            let message = { event, options }
            this.proto.send(JSON.stringify(message))
        }
    }

    ws.on("message", (message) => {
        let {event, options} = JSON.parse(message)
        console.log(`Event: ${event}`)
        console.log(options)
        dispatchPregame(socket, event, options)
        dispatchGame(socket, event, options)
    })

    ws.on('close', () => {
        let username = removeWs(socket)
        if (username) console.log("Disconnect " + username)
        console.log("Socket close")
    })
}

module.exports = handlerWs
