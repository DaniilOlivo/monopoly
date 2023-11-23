const { roomManager } = require("./rooms")

module.exports = function connect(socket, serverSockets) {
    console.log("Connect socket")

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
            socket.connectData = {username, room}
            socket.join(title)
            serverSockets.to(title).emit("dataRoom", room.players)
        }
        
    })

    socket.on("startGame", () => {
        const {room} = socket.connectData
        const game = room.startGame()
        socket.connectData.game = game
        serverSockets.to(room.title).emit("initGame")
        serverSockets.to(room.title).emit("updateGame", game)
    })

    socket.on('disconnecting', () => {
        if (socket.connectData) {
            const {username, room} = socket.connectData
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


