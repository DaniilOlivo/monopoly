const { assert } = require("chai")
const { io } = require("socket.io-client")
const request = require("request")
const server = require("../../index")

const url = "http://127.0.0.1:5500"

describe("Socket", () => {
    let socketScorpion = null
    let socketSubZero = null

    const titleRoom = "Hell"
    const usernameExpect = "Scorpion"

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
        it("register non-exist room", (done) => {
            socketScorpion.emit("register", usernameExpect, "Heaven")

            socketScorpion.once("registerResponse", (username, status, desc) => {
                assert.equal(username, usernameExpect)
                assert.isFalse(status)
                assert.equal(desc, "This room does not exist. Try connecting to another")
                done()
            })
        })

        describe("register succesful", () => {
            let registerResponse = null
            let players = null

            before(() => {
                socketScorpion.emit("register", usernameExpect, titleRoom)

                socketScorpion.once("registerResponse", (username, status, desc) => {
                    registerResponse = {username, status, desc}
                })

                socketScorpion.once("dataRoom", (dataPlayers) => {
                    players = dataPlayers
                })
            })

            it("register response", () => {
                assert.isNotNull(registerResponse)
                const {username, status, desc} = registerResponse
                assert.equal(username, usernameExpect)
                assert.isTrue(status)
                assert.equal(desc, "Ok")
            })

            it("data room", () => {
                assert.isNotNull(players)
                const listPlayers = Object.keys(players)
                assert.deepEqual(listPlayers, [usernameExpect])
                assert.isTrue(players[usernameExpect].host)
            })
        })

        describe("second socket", () => {            
            it("Attempting to register an existing user", (done) => {
                socketSubZero.emit("register", usernameExpect, titleRoom)
                socketSubZero.once("registerResponse", (username, status, desc) => {
                    assert.equal(username, usernameExpect)
                    assert.isFalse(status)
                    assert.equal(desc, "Such a player already exists")
                    done()
                })
            })

            describe("second register", () => {
                let registerResponse = null
                let dataRoom = null

                const secondUsername = "Sub Zero"

                before(() => {
                    socketSubZero.emit("register", secondUsername, titleRoom)
                    socketSubZero.once("registerResponse", (username, status, desc) => {
                        registerResponse = {username, status, desc}
                    })
                    socketSubZero.once("dataRoom", (players) => {
                        dataRoom = players
                    })
                })

                it("register succesful second player", () => {
                    assert.isNotNull(registerResponse)
                    const {username, status, desc} = registerResponse
                    assert.equal(username, secondUsername)
                    assert.isTrue(status)
                    assert.equal(desc, "Ok")
                })

                it("update room after second player", () => {
                    assert.isNotNull(dataRoom)
                    const listPlayers = Object.keys(dataRoom)
                    assert.deepEqual(listPlayers, [usernameExpect, secondUsername])
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

    describe("roll", () => {
        const statesGame = []
        const handler = (game) => {
            statesGame.push(game)
        }
        let gameV3 = null

        before(() => {
            socketScorpion.on("updateGame", handler)

            socketScorpion.emit("roll", [2, 1])
            socketSubZero.emit("roll", [5, 5])
            socketSubZero.emit("roll", [3, 3])
            socketSubZero.emit("offer", false)
            socketSubZero.emit("roll", [1, 2])
            socketSubZero.emit("offer", true)
        })

        it("set order", () => {
            const gameV2 = statesGame[1]
            assert.equal(gameV2.stage, "main")
        })

        it("position first player", () => {
            gameV3 = statesGame[2]
            const tile = gameV3.field.tiles.find((tile) => tile.players.indexOf("Sub Zero") != -1)
            const index = gameV3.field.tiles.indexOf(tile)
            assert.equal(index, 6)
        })

        it("double on dice", () => {
            gameV3 = statesGame[2]
            assert.equal(gameV3.tracker.current, "Sub Zero") 
        })

        it("waiting for a purchase decision", () => {
            assert.isNotNull(gameV3.players["Sub Zero"].service.offer)
        })

        it("refusal to purchase", () => {
            const gameV4 = statesGame[3]
            assert.isNull(gameV4.players["Sub Zero"].service.offer)
        })

        it("acceptance of purchase offer", () => {
            const gameV6 = statesGame[5]
            assert.isNull(gameV6.players["Sub Zero"].service.offer)
            assert.equal(gameV6.players["Sub Zero"].own[0], "cyan_3")
            assert.equal(gameV6.tracker.current, "Scorpion")
        })

        after(() => {
            socketScorpion.off("updateGame", handler)
        })
    })

    describe("send messages", () => {
        it("push mes", () => {
            socketScorpion.emit("sendMes", "Get over here!")
            socketScorpion.once("updateGame", (game) => {
                const mes = game.logs[4]
                assert.equal(mes.sender, usernameExpect)
                assert.equal(mes.mes, "Get over here!")
            })
        })
    })

    after(() => {
        if (socketScorpion) socketScorpion.disconnect()
        if (socketSubZero) socketSubZero.disconnect()
        server.close()
    })
})
