const { assert } = require("chai")
const { createServer } = require("http")
const { roomManager } = require("../rooms")
const ioClient = require("socket.io-client")
const ioServer = require("socket.io")
const WrapSocket = require("../socket")

function wait(socket, event) {
    return new Promise((resolve) => {
        socket.once(event, data => resolve(data))
    })
}

describe("Socket", () => {
    let httpServer, io
    let urlConnect = ""

    const titleRoom = "Hell"
    const usernamePlayer = "Scorpion"
    let socket = null

    const createSocket = () => ioClient.io(urlConnect)


    before(done => {
        httpServer = createServer()
        io = new ioServer.Server(httpServer)
        httpServer.listen(() => {
            const port = httpServer.address().port
            urlConnect = "http://127.0.0.1:" + port
            io.on("connection", socket => new WrapSocket(socket, io))
            done()
        })
    })

    describe("createRoom", () => {
        before(() => {
            socket = createSocket()
            socket.emit("createRoom", titleRoom)
        })

        it("response", async () => {
            const { title, status } = await wait(socket, "responseCreateRoom")
            assert.equal(title, titleRoom)
            assert.isTrue(status)
        })
        it("room created", () => assert.include(Object.keys(roomManager.rooms), titleRoom))
        
        after(() => {
            socket.close()
            roomManager.deleteRoom(titleRoom)    
        })
    })

    describe("pingRooms", () => {
        before(() => {
            socket = createSocket()
            roomManager.createRoom(titleRoom)
            socket.emit("pingRooms")
        })

        it("update list rooms", async () => {
            const listRooms = await wait(socket, "listRooms")
            assert.lengthOf(listRooms, 1)
            assert.equal(listRooms[0].title, titleRoom)
        })

        after(() => {
            socket.close()
            roomManager.deleteRoom(titleRoom)
        })
    })

    describe("entry-leaveLobby", () => {
        let res = null
        let players = null

        before(async () => {
            socket = createSocket()
            roomManager.createRoom(titleRoom)
            socket.emit("entryLobby", titleRoom, usernamePlayer)
            res = await wait(socket, "responseEntryLobby")
            players = await wait(socket, "dataRoom")
            socket.emit("leaveLobby")
        })

        it("response", () => {
            const { username, status } = res
            assert.equal(username, usernamePlayer)
            assert.isTrue(status)
        })

        it("data room", () => {
            const arrPlayers = Object.keys(players)
            assert.lengthOf(arrPlayers, 1)
            const username = arrPlayers[0]
            assert.equal(username, usernamePlayer)
        })

        it("leave room", () => assert.lengthOf(roomManager.getDataRooms(), 0))

        after(() => {
            socket.close()
            roomManager.deleteRoom(titleRoom)
        })
    })

    describe("game", () => {
        let initGame = null
        let pingGame = null

        before(async () => {
            socket = createSocket()
            roomManager.createRoom(titleRoom)
            socket.emit("entryLobby", titleRoom, usernamePlayer)
            socket.emit("startGame")
            initGame = await wait(socket, "updateGame")
            socket.emit("game", "ping")
            pingGame = await wait(socket, "updateGame")
        })

        it("game start", () => {
            assert.isNotNull(initGame)
        })

        it("use game", () => {
            assert.equal(pingGame.logs[pingGame.logs.length - 1].mes, "ping")
        })

        after(() => {
            socket.close()
            roomManager.deleteRoom(titleRoom)
        })
    })

    after(() => {
        io.close()
        httpServer.close()
    })
})
