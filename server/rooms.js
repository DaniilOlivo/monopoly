const rooms = {}

function getRooms() {
    return Object.keys(rooms)
}

// Getting players in a room without a web socket
function getPlayers(titleRoom) {
    if (!(titleRoom in rooms)) return false
    let room = rooms[titleRoom]
    return Object.keys(room)
}

function createRoom(titleRoom) {
    if (titleRoom in rooms) return false
    rooms[titleRoom] = {}
    return true
}

function addPlayer(username, ws, titleRoom) {
    let room = rooms[titleRoom]
    let players = Object.keys(room)

    if (players.length >= 8) return [false, "Room overflow"]
    for (const player of players) {
        if (player == username) return [false, "Such a player already exists"]
    }

    room[username] = ws
    return [true, "Ok"]
}

function removePlayer(username, titleRoom) {
    let room = rooms[titleRoom]
    delete room[username]
}

function checkEmptyRooms() {
    for (let titleRoom of Object.keys(rooms)) {
        let room = rooms[titleRoom]
        if (Object.keys(room).length == 0) delete rooms[titleRoom]
    }
}

module.exports = {
    rooms, createRoom, addPlayer, removePlayer, getRooms, getPlayers, checkEmptyRooms
}
