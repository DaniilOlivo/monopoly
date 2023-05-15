class Room {
    constructor(title) {
        this.title = title
        this.host = ""
        this.players = {}
        this.sockets = []
        this.countPlayers = 0
    }

    setHost() {
        let sockets = this.sockets
        if (sockets.length > 0)  {
            let firstSocket = this.sockets[0]
            for (const [username, ws] of Object.entries(this.players)) {
                if (ws === firstSocket) {
                    this.host = username
                    break
                }
            }
        }
        else this.host = ""
    }

    // Getting players in a room without a web socket
    getPlayers() {
        return Object.keys(this.players)
    }

    addPlayer(username, ws) {
        if (this.countPlayers >= 8) return [false, "Room overflow"]
        if (username in this.players) return [false, "Such a player already exists"]

        this.players[username] = ws
        this.countPlayers++
        this.sockets.push(ws)
        this.setHost()

        return [true, "Ok"]
    }

    removePlayer(username) {
        let ws = this.players[username]
        delete this.players[username]
        this.countPlayers--
        this.sockets.splice(this.sockets.indexOf(ws), 1)
        this.setHost()
    }

    broadcast(event, options={}) {
        for (const socket of this.sockets) {
            socket.sendMessage(event, options)
        }
    }
}

class RoomManager {
    constructor() {
        this.rooms = {}
    }

    getTitlesRooms() {
        return Object.keys(this.rooms)
    }

    findWs(searchableWs) {
        for (const room of Object.values(this.rooms)) {
            for (const [username, ws] of Object.entries(room.players)) {
                if (ws == searchableWs) {
                    return {
                        find: true,
                        room,
                        username
                    }
                }
            }
        }

        return {find: false}
    }

    createRoom(title) {
        if (title in this.rooms) return false
        this.rooms[title] = new Room(title)
        return true
    }

    deleteRoom(title) {
        delete this.rooms[title]
    }
}

module.exports = new RoomManager()
