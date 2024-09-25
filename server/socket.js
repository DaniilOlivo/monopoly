const { Socket, Server } = require("socket.io")
const { roomManager, LIMIT_ROOM } = require("./rooms")
const Controller = require("./game/contoller")

// Special group for sockets looking for rooms
const FINDING_ROOMS = "findingRooms"

class WrapSocket {
    constructor(originalSocket=new Socket(), server=new Server()) {
        this.socket = originalSocket
        this.server = server
        this.data = {
            room: null,
            username: "",
        }

        const linkEvent = (event, func) => {
            this.socket.on(event, func.bind(this))
        }

        linkEvent("createRoom", this.receiveCreateRoom)

        linkEvent("pingRooms", this.receivePingRooms)
        linkEvent("pongRooms", this.receivePongRooms)

        linkEvent("pingGame", this.receivePingGame)

        linkEvent("entryLobby", this.receiveEntryLobby)
        linkEvent("leaveLobby", this.receiveLeaveLobby)

        linkEvent("startGame", this.receiveStartGame)
        linkEvent("game", this._useGame)

        linkEvent("disconnecting", this.receiveLeaveLobby)
    }

    // System methods
    _useGame(command, options) {
        const {username, room} = this.data
        const controller = new Controller(room.game)
        controller.execute(username, command, options)
        this.sendUpdateGame()
    }

    // Receives methods
    receiveCreateRoom(title) {
        const result = roomManager.createRoom(title)
        const res = {
            title,
            status: result,
            desc: result ? "ok" : "existRoom"
        }
        this.socket.emit("responseCreateRoom", res)
        this.sendListRooms()
    }

    receivePingRooms() {
        this.socket.join(FINDING_ROOMS)
        this.sendListRooms()
    }

    receivePongRooms() {
        this.socket.leave(FINDING_ROOMS)
    }

    receivePingGame() {
        const { room, username } = this.data
        if (room && room.game) {
            let objPlayer = Object.values(room.players).find(player => !player.connect)
            if (!objPlayer) return
            clearTimeout(objPlayer.timerReconnect)
            objPlayer.timerReconnect = null
            objPlayer.idSocket = this.socket.id
            this.socket.join(room.title)
            this.socket.emit("reconnect", username)
            this._useGame("message", {message: "reconnect"})
        }
    }

    receiveEntryLobby(titleRoom, username) {
        const room = roomManager.rooms[titleRoom]
        let status = false
        let desc = ""
        if (room) [status, desc] = room.addPlayer(username, this.socket.id)
        else desc = "nonExist"
        this.socket.emit("responseEntryLobby", {username, status, desc})

        if (status) {
            this.socket.leave(FINDING_ROOMS)
            this.sendListRooms()
            this.data = { room, username }
            this.socket.join(titleRoom)
            this.server.to(titleRoom).emit("dataRoom", room.players)
        }
    }

    receiveLeaveLobby(options={}) {
        if (!this.data.room) return

        const leave = () => {
            room.removePlayerById(this.socket.id)
            this.socket.to(room.title).emit("dataRoom", room.players)
            this.socket.leave(room.title)
            if (0 == room.getCountPlayers()) roomManager.deleteRoom(room.title)
            this.sendListRooms()
        }

        const { room, username } = this.data
        if (room.game) {
            const mesGame = (message) => {
                if (!options.noUpdate) this._useGame("message", {message})
            }

            if (options.force) {
                mesGame("leave game!")
                if (!options.noUpdate) this._useGame("disconnect")
                leave()
            } else {
                mesGame("connection lost. Trying to reconnect")
                const player = room.players[username]
                player.connect = false
                player.timerReconnect = setTimeout(() => {
                    if (!options.noUpdate) this._useGame("disconnect")
                    leave()
                }, (process.env.NODE_ENV == "test") ? 0 : 8000)
            }
            
        } else leave()
    }

    receiveStartGame(options={}) {
        this.data.room.startGame(options)
        this.sendUpdateGame()
    }

    // Send signals methods
    sendListRooms() {
        const list = roomManager.getDataRooms()
        const filteredList =  list.filter(room => room.count < LIMIT_ROOM && room.status == "lobby")
        this.server.to(FINDING_ROOMS).emit("listRooms", filteredList)
    }

    sendUpdateGame() {
        const { title, game } = this.data.room
        this.server.to(title).emit("updateGame", game)
    }

}

module.exports = WrapSocket
