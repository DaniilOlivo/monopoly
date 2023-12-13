const { assert } = require("chai")
const { io } = require("socket.io-client")
const request = require("request")
const server = require("../../index")

const url = "http://127.0.0.1:5500"

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
    let socketScorpion = null
    let socketSubZero = null

    const titleRoom = "Hell"

    before((done) => {
        request.post(
            url + "/api/create",
            {json: {title: titleRoom}},
            (err, res, body) => {
                if (!err && res.statusCode == 200 && body.ok) {
                    socketScorpion = io(url)
                    socketSubZero = io(url)
                    done()
                }
            }
        )
    })

    describe("register", () => {
        it("register non-exist room", async () => {
            socketScorpion.emit("register", "Scorpion", "Heaven")
            const [username, status, desc] = await wait(socketScorpion, "registerResponse")
            assert.equal(username, "Scorpion")
            assert.isFalse(status)
            assert.equal(desc, "This room does not exist. Try connecting to another")
        })

        describe("register succesful", () => {
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
            it("Attempting to register an existing user", async () => {
                socketSubZero.emit("register", "Scorpion", titleRoom)
                const [username, status, desc] = await wait(socketSubZero, "registerResponse")
                assert.equal(username, "Scorpion")
                assert.isFalse(status)
                assert.equal(desc, "Such a player already exists")
            })

            describe("second register", () => {
                let res = []

                before(async () => {
                    socketSubZero.emit("register", "Sub Zero", titleRoom)
                    res = await waitMany(socketSubZero, ["registerResponse", "dataRoom"])
                })

                it("register succesful second player", () => {
                    const [username, status, desc] = res[0]
                    assert.equal(username, "Sub Zero")
                    assert.isTrue(status)
                    assert.equal(desc, "Ok")
                })

                it("update room after second player", () => {
                    const [dataRoom] = res[1]
                    assert.deepEqual(Object.keys(dataRoom), ["Scorpion", "Sub Zero"])
                })
            })
        })
    }) 

    describe("startGame", () => {
        let initGame = false
        let updateGame = null
        
        before(() => {
            socketScorpion.emit("startGame")
            
            socketScorpion.once("initGame", () => initGame = true)
            socketScorpion.once("updateGame", (game) => updateGame = game)
        })

        it("init game", () => {
            assert.isTrue(initGame)
        })

        it("update game", () => {
            assert.isNotNull(updateGame)
        })
    })

    describe("send messages", () => {
        it("push mes", (done) => {
            socketScorpion.emit("sendMes", "Get over here!")
            socketScorpion.once("updateGame", (game) => {
                const mes = game.logs[0]
                assert.equal(mes.sender, "Scorpion")
                assert.equal(mes.mes, "Get over here!")
                done()
            })
        })
    })

    describe("roll", () => {
        async function waitUpdateGame() {
            const [game] = await wait(socketScorpion, "updateGame")
            return game
        }

        // Intermediate storage for temporary data, like the current version of the game
        let buffer = {}

        it("set order", async () => {
            socketScorpion.emit("roll", [2, 1])
            await waitUpdateGame()
            socketSubZero.emit("roll", [5, 5])
            const game = await waitUpdateGame()
            assert.equal(game.stage, "main")
        })

        it("position first player", async () => {
            socketSubZero.emit("roll", [3, 3])
            game = await waitUpdateGame()
            tile = game.field.tiles.find((tile) => tile.players.indexOf("Sub Zero") != -1)

            buffer.game = game
            buffer.tile = tile

            const index = game.field.tiles.indexOf(tile)
            assert.equal(index, 6)
        })

        it("double on dice", () => {
            assert.equal(buffer.game.tracker.current, "Sub Zero") 
        })

        it("waiting for a purchase decision", () => {
            const {game, tile} = buffer
            assert.deepEqual(game.players["Sub Zero"].service.offer, tile)
        })

        it("refusal to purchase", async () => {
            socketSubZero.emit("offer", false)
            const game = await waitUpdateGame()
            assert.isNull(game.players["Sub Zero"].service.offer)
        })

        it("acceptance of purchase offer", async () => {
            socketSubZero.emit("roll", [1, 2])
            await waitUpdateGame()
            socketSubZero.emit("offer", true)
            const game = await waitUpdateGame()
            assert.isNull(game.players["Sub Zero"].service.offer)
            assert.equal(game.players["Sub Zero"].own[0], "cyan_3")
            assert.equal(game.tracker.current, "Scorpion")
        })
    })

    after(() => {
        if (socketScorpion) socketScorpion.disconnect()
        if (socketSubZero) socketSubZero.disconnect()
        server.close()
    })
})
