const { WebSocket, WebSocketServer } = require("ws")

const rooms = require("./rooms")

function sendMessage(ws, event, options={}) {
    let message = { event, options }
    ws.send(JSON.stringify(message))
}

function broadcastRoom(titleRoom, event, options={}) {
    let room = rooms.rooms[titleRoom]
    for (const { ws } of Object.values(room)) {
        sendMessage(ws, event, options)
    }
}

function sendDataRoom(titleRoom) {
    let players = rooms.getPlayers(titleRoom)
    if (players) broadcastRoom(titleRoom, "data_room", players)
}

function removeWs(closedWs) {
    let username = null

    for (let [titleRoom, room] of Object.entries(rooms.rooms)) {
        for (let [id, data] of Object.entries(room)) {
            if (data.ws === closedWs) {
                rooms.removePlayer(id, titleRoom)
                sendDataRoom(titleRoom)
                username = data.username
            }
        }
    }

    rooms.checkEmptyRooms()
    return username
}

function register(username, ws, titleRoom) {
    let result = rooms.addPlayer(username, ws, titleRoom)
    if (result) sendDataRoom(titleRoom)
}

function createSocketHandler(wsServer = new WebSocketServer()) {
    return (ws = new WebSocket()) => {
        console.log("Connect WS")
    
        ws.on('error', console.error)

        ws.on("message", (message) => {
            let {event, options} = JSON.parse(message)
            console.log(`Event: ${event}`)
            console.log(options)
            if (event == "register") register(options.username, ws, options.titleRoom)
        })

        ws.on('close', () => {
            let username = removeWs(ws)
            if (username) console.log("Disconnect " + username)
            console.log("Socket close")
        })
    }
}

module.exports = createSocketHandler
