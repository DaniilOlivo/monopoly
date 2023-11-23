const { assert } = require("chai")
const { io } = require("socket.io-client")
const request = require("request")
const server = require("../../index")

const url = "http://127.0.0.1:5500"

describe("Socket", () => {
    let socket = null

    const titleRoom = "Hell"
    const usernameExpect = "Scorpion"

    before((done) => {
        request.post(
            url + "/api/create",
            {json: {title: titleRoom}},
            (err, res, body) => {
                if (!err && res.statusCode == 200 && body.ok) {
                    socket = io(url)
                    done()
                }
            }
        )
    })

    describe("register", () => {
        it("register non-exist room", (done) => {
            socket.emit("register", usernameExpect, "Heaven")

            socket.once("registerResponse", (username, status, desc) => {
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
                socket.emit("register", usernameExpect, titleRoom)

                socket.once("registerResponse", (username, status, desc) => {
                    registerResponse = {username, status, desc}
                })

                socket.once("dataRoom", (dataPlayers) => {
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
            const secondSocket = io(url)
            
            it("Attempting to register an existing user", (done) => {
                secondSocket.emit("register", usernameExpect, titleRoom)
                secondSocket.once("registerResponse", (username, status, desc) => {
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
                    secondSocket.emit("register", secondUsername, titleRoom)
                    secondSocket.once("registerResponse", (username, status, desc) => {
                        registerResponse = {username, status, desc}
                    })
                    secondSocket.once("dataRoom", (players) => {
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

            after(() => {
                secondSocket.disconnect()
            })
        })
    }) 

    describe("startGame", () => {
        let initGame = false
        let updateGame = null
        
        before(() => {
            socket.emit("startGame")

            socket.once("initGame", () => initGame = true)
            socket.once("updateGame", (game) => updateGame = game)
        })

        it("init game", () => {
            assert.isTrue(initGame)
        })

        it("update game", () => {
            assert.isNotNull(updateGame)
        })
    })

    after(() => {
        if (socket) socket.disconnect()
        server.close()
    })
})
