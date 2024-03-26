const { roomManager } = require("./rooms")

const mapSockets = {}

module.exports = function connect(socket, serverSockets) {
    console.log("Connect socket")

    const updateGame = (room) => {
        serverSockets.to(room.title).emit("updateGame", room.game)
    }
 
    const gameUse = () => {
        const { username, room } = mapSockets[socket.id]

        updateGame(room)
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

    socket.on("game", (command, ...args) => {
        const {username, room} = mapSockets[socket.id]
        const game = room.game

        const apiGames = {
            "message": ([mes]) => game.pushLog(mes, username),
            "roll": ([dices]) => game.roll(dices, username),
            "next": game.next,
            "buy": ([resolve]) => {
                game.buyOwn(username, {clearService: resolve})
                game.next()
            },
            "pledge": ([action, idTile]) => {
                if (action == "put") game.putPledge(idTile)
                else if (action == "redeem") game.redeemPledge(idTile)
                else game.error("Invalid action", action)
            },
            "building": ([action, idTile]) => {
                if (action == "add") game.addBuilding(idTile)
                else if (action == "remove") game.removeBuilding(idTile)
                else game.error("Invalid action", action)
            },
            "rent": () => {
                game.rent(username)
                game.next()
            },
            "sell": ([idTile]) => game.sell(idTile),
            "tax": () => game.tax(username),
            "deal": ([objDeal]) => game.deal(username, objDeal),
            "trade": ([resolve]) => game.trade(username, {clearService: resolve})
        }

        if (command in apiGames) apiGames[command](args)
        else game.error("Invalid command", command)
        updateGame(room)
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
}


