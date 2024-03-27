const { assert } = require("chai")
const { roomManager } = require("../rooms")
const ioClient = require("socket.io-client")
const ioServer = require("socket.io")
const { createServer } = require("http")

const handlerSocket = require("../socket")

function wait(socket, event) {
    return new Promise((resolve) => {
        socket.once(event, (...data) => resolve(data))
    })
}

function waitMany(socket, eventsList) {
    const arrPromises = []
    for (const event of eventsList) arrPromises.push(wait(socket, event))
    return Promise.all(arrPromises)
}

describe("Socket", () => {
    let httpServer, io
    let urlConnect = ""

    const registerSocket = (username, titleRoom) => {
        let socket = ioClient.io(urlConnect)
        socket.emit("register", username, titleRoom)
        return socket
    }

    before(done => {
        httpServer = createServer();
        io = new ioServer.Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port
            urlConnect = "http://127.0.0.1:" + port
            io.on("connection", (socket) => handlerSocket(socket, io))
            done()
        })
    })

    describe("register", () => {
        let socketScorpion = null
        const titleRoom = "Hell"

        before(() => {
            socketScorpion = ioClient.io(urlConnect)
            roomManager.createRoom(titleRoom)
        })

        it("register non-exist room", async () => {
            socketScorpion.emit("register", "Scorpion", "Heaven")
            const [username, status, desc] = await wait(socketScorpion, "registerResponse")
            assert.equal(username, "Scorpion")
            assert.isFalse(status)
            assert.equal(desc, "This room does not exist. Try connecting to another")
        })

        describe("register sucessfully", () => {
            let res = []

            before(async () => {
                socketScorpion.emit("register", "Scorpion", titleRoom)
                res = await waitMany(socketScorpion, ["registerResponse", "dataRoom"])
            })

            it("register response", () => {
                const [username, status, desc] = res[0]
                assert.equal(username, "Scorpion")
                assert.isTrue(status)
                assert.equal(desc, "Ok")
            })

            it("data room", () => {
                const [dataRoom] = res[1]
                assert.deepEqual(Object.keys(dataRoom), ["Scorpion"])
                assert.isTrue(dataRoom["Scorpion"].host)
            })
        })

        describe("second socket", () => {
            let socketSubZero = null

            before(() => {
                socketSubZero = ioClient.io(urlConnect)
            })
          
            it("Attempting to register an existing user", async () => {
                socketSubZero.emit("register", "Scorpion", titleRoom)
                const [username, status, desc] = await wait(socketSubZero, "registerResponse")
                assert.equal(username, "Scorpion")
                assert.isFalse(status)
                assert.equal(desc, "Such a player already exists")
            })

            describe("Successfully registered", () => {
                let res = []

                before(async () => {
                    socketSubZero.emit("register", "Sub Zero", titleRoom)
                    res = await waitMany(socketSubZero, ["registerResponse", "dataRoom"])
                })

                it("register response", () => {
                    const [username, status, desc] = res[0]
                    assert.equal(username, "Sub Zero")
                    assert.isTrue(status)
                    assert.equal(desc, "Ok")
                })

                it("data room", () => {
                    const [dataRoom] = res[1]
                    assert.deepEqual(Object.keys(dataRoom), ["Scorpion", "Sub Zero"])
                })
            })

            after(() => {
                socketSubZero.close()
            })
        })

        after(() => {
            socketScorpion.close()
            roomManager.deleteRoom(titleRoom)
        })
    })

    describe("startGame", () => {
        const titleRoom = "Arena"

        let initGame = false
        let updateGame = null

        let socketSonyaBlade = null
        let socketKitana = null
        
        before((done) => {
            roomManager.createRoom(titleRoom)
            socketSonyaBlade = registerSocket("Sonya Blade", titleRoom)
            socketKitana = registerSocket("Kitana", titleRoom)
            
            socketSonyaBlade.emit("startGame")
            
            socketSonyaBlade.once("initGame", () => initGame = true)
            socketSonyaBlade.once("updateGame", (game) => {
                updateGame = game
                done()
            })
        })

        it("init game", () => {
            assert.isTrue(initGame)
        })

        it("update game", () => {
            assert.isNotNull(updateGame)
        })

        after(() => {
            socketSonyaBlade.close()
            socketKitana.close()
            roomManager.deleteRoom(titleRoom)
        })
    })

    describe("game", () => {
        const titleRoom = "Dead forest"

        let socketMelina = null
        let socketJade = null

        const waitGame = async (socket) => {
            const [game] = await wait(socket, "updateGame")
            return game
        }
        const getLastMes = (game) => game.logs[game.logs.length - 1]

        before(async () => {
            roomManager.createRoom(titleRoom)
            socketMelina = registerSocket("Melina", titleRoom)
            await wait(socketMelina, "registerResponse")
            socketJade = registerSocket("Jade", titleRoom)
            await wait(socketJade, "registerResponse")
            socketMelina.emit("startGame")
            await waitGame(socketMelina, "updateGame")
        })

        let game = null
        let gameJade = null

        before(async () => {
            socketMelina.emit("game", "ping")
            game = await waitGame(socketMelina, "updateGame")
            gameJade = await waitGame(socketJade, "updateGame")
        })

        it("game has been updated", () => assert.isNotNull(game))
        it("another player updated their game", () => assert.isNotNull(gameJade))
        it("game api worked", () => {
            const objMes = getLastMes(game)
            assert.equal(objMes.mes, "ping")
            assert.equal(objMes.sender, "Melina")
        })

        after(() => {
            socketMelina.close()
            socketJade.close()
            roomManager.deleteRoom(titleRoom)
        })
    })

    after(() => {
        io.close()
        httpServer.close()
    })
})
