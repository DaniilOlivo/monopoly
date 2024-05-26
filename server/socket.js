const { roomManager } = require("./rooms")
const Controller = require("./game/contoller")

const mapSockets = {}

module.exports = function connect(socket, serverSockets) {
    const updateGame = (room) => {
        serverSockets.to(room.title).emit("updateGame", room.game)
    }

    socket.on("register", (username, title) => {
        const room = roomManager.rooms[title]
        let status = false
        let desc = ""
        if (room) {
            [status, desc] = room.addPlayer(username, socket.id)
        } else {
            desc = "This room does not exist. Try connecting to another"
        }
        socket.emit("registerResponse", username, status, desc)

        if (status) {
            mapSockets[socket.id] = {username, room}
            socket.join(title)
            serverSockets.to(title).emit("dataRoom", room.players)
        }
        
    })

    socket.on("startGame", () => {
        const {room} = mapSockets[socket.id]
        room.startGame()
        serverSockets.to(room.title).emit("initGame")
        updateGame(room)
    })

    socket.on("game", (command, options) => {
        const {username, room} = mapSockets[socket.id]
        const controller = new Controller(room.game)
        controller.execute(username, command, options)
        updateGame(room)
    })

    socket.on('disconnecting', () => {
        if (!(socket.id in mapSockets)) return

        const {username, room} = mapSockets[socket.id]
        const titleRoom = room.title

        room.removePlayerByName(username)
        socket.to(titleRoom).emit("dataRoom", room.players)
        socket.leave(titleRoom)

        if (0 == room.getCountPlayers()) {
            roomManager.deleteRoom(titleRoom)
        }
    })
}


