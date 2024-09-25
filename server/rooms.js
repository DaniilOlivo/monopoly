const Game = require("./game/core")

const LIMIT_ROOM = 8

class Room {
    constructor(title) {
        this.title = title
        this.players = {}
        this.game = null
    }

    _setHost() {
        if (this.getCountPlayers() > 0) {
            const firstPlayer = Object.keys(this.players)[0]
            this.players[firstPlayer].host = true
        }
    }

    getCountPlayers() {
        return Object.keys(this.players).length
    }

    addPlayer(username, idSocket) {
        const count = this.getCountPlayers()

        if (count >= LIMIT_ROOM) return [false, "overflow"]
        if (username in this.players) return [false, "existUsername"]
        

        this.players[username] = {
            idSocket,
            connect: true,
            timerReconnect: null
        }
        this._setHost()
        return [true, "Ok"]
    }

    removePlayerByName(username) {
        delete this.players[username]
        this._setHost()
    }

    removePlayerById(idSocket) {
        for (const [username, data] of Object.entries(this.players)) {
            if (data.idSocket === idSocket) {
                this.removePlayerByName(username)
                break
            }
        } 
    }

    startGame(optionsGame) {
        this.game = new Game(Object.keys(this.players), optionsGame.lang)
        return this.game
    }
}

class RoomManager {
    constructor() {
        this.rooms = {}
    }

    getTitles() {
        return Object.keys(this.rooms)
    }

    getDataRooms() {
        const resultList = []
        for (const [title, room] of Object.entries(this.rooms)) {
            resultList.push({
                title,
                count: room.getCountPlayers(),
                status: room.game ? "gameOn" : "lobby"
            })
        }
        return resultList
    }

    findPlayer(id) {
        for (const room of Object.values(this.rooms)) {
            for (const [username, data] of Object.entries(room.players)) {
                if (data.idSocket === id) {
                    return [true, room, username]
                }
            }
        }

        return [false, null, ""]
    }

    createRoom(title) {
        if (this.getTitles().indexOf(title) != -1) return false
        this.rooms[title] = new Room(title)
        return true
    }

    deleteRoom(title) {
        if (this.getTitles().indexOf(title) != -1) {
            delete this.rooms[title]
            return true
        } else return false
    }
}

module.exports = {
    Room,
    RoomManager,
    roomManager: new RoomManager(),
    LIMIT_ROOM
}
