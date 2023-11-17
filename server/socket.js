const { roomManager } = require("./rooms")

module.exports = function connect(socket) {
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
            socket.join(title)
            socket.emit("dataRoom", room.players)
            socket.to(title).emit("dataRoom", room.players)
        }
        
    })

    socket.on('disconnecting', () => {
        const [status, room, username] = roomManager.findPlayer(socket.id)

        if (status) {
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


