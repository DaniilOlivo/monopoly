const { roomManager } = require("./rooms")

const mapSockets = {}

module.exports = function connect(socket, serverSockets) {
    console.log("Connect socket")

    function updateGame(room) {
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
        const game = room.startGame()
        serverSockets.to(room.title).emit("initGame")
        updateGame(room)
    })

    socket.on("roll", (valuesDices) => {
        const {username, room} = mapSockets[socket.id]
        room.game.roll(valuesDices, username)
        updateGame(room)
    })

    socket.on("next", () => {
        const {room} = mapSockets[socket.id]
        room.game.next()
        updateGame(room)
    })

    socket.on("sendMes", (mes) => {
        const {username, room} = mapSockets[socket.id]
        room.game.pushLog(mes, username)
        serverSockets.to(room.title).emit("updateGame", room.game)
    })

    socket.on('disconnecting', () => {
        if (mapSockets[socket.id]) {
            const {username, room} = mapSockets[socket.id]
            const titleRoom = room.title

            room.removePlayerByName(username)
            socket.to(titleRoom).emit("dataRoom", room.players)
            socket.leave(titleRoom)
            console.log(`Disconnect ${username} player`)

            if (0 == room.getCountPlayers()) {
                roomManager.deleteRoom(titleRoom)
            }
        } else {
            console.log("Disconnect anonymous socket")
        }
    })

    // socket.on("disconnect", () => console.log("Disconnect"))
}


