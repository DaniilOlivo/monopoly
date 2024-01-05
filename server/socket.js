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

    socket.on("offer", (result) => {
        const {username, room} = mapSockets[socket.id]
        if (result) {
            const tileId = room.game.players[username].service.offer.id
            room.game.buyOwn(tileId, username)
        }
        room.game.players[username].clearService("offer")
        room.game.next()
        updateGame(room)
    })

    socket.on("deal", (objDeal) => {
        const {username, room} = mapSockets[socket.id]
        objDeal.initiator = username
        room.game.offerDeal(objDeal)
        updateGame(room)
    })

    socket.on("trade", (result) => {
        const {username, room} = mapSockets[socket.id]
        if (result) room.game.trade(username)
        else room.game.players[username].clearService("deal")
        updateGame(room)
    })

    socket.on("rent", () => {
        const {username, room} = mapSockets[socket.id]
        room.game.rent(username)
        room.game.players[username].clearService("rent")
        room.game.next()
        updateGame(room)
    })

    socket.on("pay", () => {
        const {username, room} = mapSockets[socket.id]
        room.game.pay(username)
        room.game.next()
        updateGame(room)
    })

    socket.on("next", () => {
        const {room} = mapSockets[socket.id]
        room.game.next()
        updateGame(room)
    })

    socket.on("buy", (idTile) => {
        const {username, room} = mapSockets[socket.id]
        room.game.buyOwn(idTile, username)
        updateGame(room)
    })

    socket.on("addBuilding", (idTile) => {
        const {room} = mapSockets[socket.id]
        room.game.addBuilding(idTile)
        updateGame(room)
    })

    socket.on("removeBuilding", (idTile) => {
        const {room} = mapSockets[socket.id]
        room.game.removeBuilding(idTile)
        updateGame(room)
    })

    socket.on("putPledge", (idTile) => {
        const {room} = mapSockets[socket.id]
        room.game.putPledge(idTile)
        updateGame(room)
    })

    socket.on("redeemPledge", (idTile) => {
        const {room} = mapSockets[socket.id]
        room.game.redeemPledge(idTile)
        updateGame(room)
    })

    socket.on("sell", (idTile) => {
        const {room} = mapSockets[socket.id]
        room.game.sell(idTile)
        updateGame(room)
    })

    socket.on("sendMes", (mes) => {
        const {username, room} = mapSockets[socket.id]
        room.game.pushLog(mes, username)
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

    // socket.on("disconnect", () => console.log("Disconnect"))
}


