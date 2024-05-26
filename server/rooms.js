const Game = require("./game/core")

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

        if (count >= 8) return [false, "Room overflow"]
        if (username in this.players) return [false, "Such a player already exists"]
        

        this.players[username] = {idSocket}
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

    startGame() {
        this.game = new Game(Object.keys(this.players))
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
        const resultObject = {}
        for (const [title, room] of Object.entries(this.rooms)) {
            resultObject[title] = {
                count: room.getCountPlayers()
            }
        }
        return resultObject
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
    roomManager: new RoomManager()
}
