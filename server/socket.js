const { roomManager } = require("./rooms")
const Controller = require("./game/contoller")

const mapSockets = {}

module.exports = function connect(socket, serverSockets) {
    const updateGame = (room) => {
        serverSockets.to(room.title).emit("updateGame", room.game)
    }

    const disconnectPlayer = (room) => {
        room.removePlayerById(socket.id)
        socket.to(room.title).emit("dataRoom", room.players)
        socket.leave(room.title)

        if (0 == room.getCountPlayers()) {
            roomManager.deleteRoom(room.title)
        }

        delete mapSockets[socket.id]
    }

    const useGame = (command, options) => {
        const {username, room} = mapSockets[socket.id]
        const controller = new Controller(room.game)
        controller.execute(username, command, options)
        updateGame(room)
    }

    socket.on("pingGame", (titleRoom) => {
        const room = roomManager.rooms[titleRoom]
        if (room && room.game) {
            const entry = Object.entries(mapSockets).find(entry => entry[1].timer)
            if (entry) {
                const [idSocket, objSocket] = entry
                
                delete mapSockets[idSocket]
                socket.leave(idSocket)

                clearTimeout(objSocket.timer)
                delete objSocket.timer

                mapSockets[socket.id] = objSocket
                socket.join(titleRoom)

                socket.emit("reconnect", objSocket.username)
                useGame("message", {message: "reconnect"})
            }

            socket.emit("updateGame", room.game)
        }
    })

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
        updateGame(room)
    })

    socket.on("game", useGame)

    socket.on('disconnecting', () => {
        if (!(socket.id in mapSockets)) return

        const {room} = mapSockets[socket.id]

        const game = room.game
        if (game) {
            useGame("message", {message: "connection lost. Trying to reconnect"})
            mapSockets[socket.id].timer = setTimeout(() => {
                useGame("disconnect")
                disconnectPlayer(room)
            }, (process.env.NODE_ENV == "test") ? 0 : 8000)


        } else disconnectPlayer(room)  
    })
}


