const { assert } = require("chai")
const { Room, RoomManager } =require("../rooms")

describe("Rooms logic", () => {
    describe("Room class", () => {
        let room = new Room("Room test")

        describe("addPlayer", () => {
            const result = room.addPlayer("Scorpion", "123")

            it("result", () => {
                const [status, desc] = result
                assert.isTrue(status)
                assert.equal(desc, "Ok")
            })

            it("length", () => {    
                assert.equal(room.getCountPlayers(), 1)
            })

            it("host", () => {
                const player = room.players["Scorpion"]
                assert.isTrue(player.host)
            })

            it("add exist player", () => {
                const [status, desc] = room.addPlayer("Scorpion", "345")
                assert.isFalse(status)
                assert.equal(desc, "Such a player already exists")
                assert.equal(room.getCountPlayers(), 1)
            })

            it("overflow players", () => {
                const players = [
                    "Sub Zero",
                    "Sonya Blade",
                    "Shao Kahn",
                    "Johny Cage",
                    "Reptile",
                    "Noob Saibot",
                    "Kitana"
                ]
                for (const player of players) {
                    room.addPlayer(player, "123")
                }
                const [status, desc] = room.addPlayer("Jade", "123")
                assert.equal(room.getCountPlayers(), 8)
                assert.isFalse(status)
                assert.equal(desc, "Room overflow")
            })
        })

        describe("removePlayer", () => {
            let room = new Room("Room test")
            
            beforeEach(() => {
                room.addPlayer("Scorpion", "123")
            })

            it("remove by name", () => {
                room.removePlayerByName("Scorpion")
                assert.equal(room.getCountPlayers(), 0)
            })

            it("remove by id", () => {
                room.removePlayerById("123")
                assert.equal(room.getCountPlayers(), 0)
            })

            it("remove host", () => {
                room.addPlayer("Sub Zero", "456")
                room.removePlayerByName("Scorpion")
                const secondPlayer = room.players["Sub Zero"]
                assert.isTrue(secondPlayer.host)
            })
        })
    })

    describe("RoomManager class", () => {
        let manager = new RoomManager()

        describe("create room", () => {
            before(() => {
                manager = new RoomManager()
            })

            it("succes create", () => {
                const result = manager.createRoom("Room test")
                assert.isTrue(result)
            })

            it("exist room", () => {
                const result = manager.createRoom("Room test")
                assert.isFalse(result)
            })
        })

        describe("get info rooms", () => {
            before(() => {
                manager = new RoomManager()
            })

            it("get titles", () => {
                assert.deepEqual(manager.getTitles(), [])
                manager.createRoom("Room test")
                assert.deepEqual(manager.getTitles(), ["Room test"])
            })
    
            it("get data rooms", () => {
                manager.rooms["Room test"].addPlayer("Scorpion", "123")
                const data = manager.getDataRooms()
                assert.deepEqual(data, {"Room test": {count: 1}})
            })
        })

        describe("find player", () => {
            before(() => {
                manager = new RoomManager()
                manager.createRoom("Room test")
                let room = manager.rooms["Room test"]
                room.addPlayer("Scorpion", "123")
                room.addPlayer("Sub Zero", "345")
            })

            it("succesful find", () => {
                let [status, room, username] = manager.findPlayer("123")
                assert.isTrue(status)
                assert.equal(room.title, "Room test")
                assert.equal(username, "Scorpion")
            })

            it("fail find", () => {
                let [status, room, username] = manager.findPlayer("666")
                assert.isFalse(status)
                assert.isNull(room)
                assert.equal(username, "")
            })
        })

        describe("delete room", () => {
            before(() => {
                manager = new RoomManager()
            })

            it("succesful delete", () => {
                manager.createRoom("Room test")
                const result = manager.deleteRoom("Room test")
                assert.deepEqual(manager.rooms, {})
                assert.isTrue(result)
            })

            it("unsuccessful delete", () => {
                const result = manager.deleteRoom("Non-exist room")
                assert.isFalse(result)
            })
        })
    })
})
