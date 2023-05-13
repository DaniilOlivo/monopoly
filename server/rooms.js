const rooms = {}

function getRooms() {
    return Object.keys(rooms)
}

// Getting players in a room without a web socket
function getPlayers(titleRoom) {
    if (titleRoom in rooms) return false
    let room = rooms[titleRoom]
    let players = {}
    Object.keys(room).forEach((idPlayer) => players[idPlayer] = room[idPlayer].username)
    return players
}

function createRoom(titleRoom) {
    if (titleRoom in rooms) return false
    rooms[titleRoom] = {}
    return true
}

function addPlayer(username, ws, titleRoom) {
    let room = rooms[titleRoom]
    let keys = Object.keys(room)

    if (keys.length >= 8) return false

    let id = 0
    while (id in keys) id++

    room[id] = {username, ws}
    return true
}

function removePlayer(id, titleRoom) {
    let room = rooms[titleRoom]
    delete room[id]
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
