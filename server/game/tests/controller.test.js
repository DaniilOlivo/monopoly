const { assert } = require('chai')

const Core = require("../core")
const Contoller = require("../contoller")

const arrPlayers = ["Scorpion", "Sub Zero"]

describe("Start game", () => {
    let core = new Core(arrPlayers)
    let controller = new Contoller(core)
    controller.catchErrors = false

    before(() => {
        controller.execute("Scorpion", "roll", {dices: [2, 2]})
        controller.execute("Sub Zero", "roll", {dices: [3, 4]})
    })

    it("players order", () => assert.deepEqual(core.tracker.order, ["Sub Zero", "Scorpion"]))
    it("change stage", () => assert.equal(core.stage, "main"))
})

describe("Executor methods", () => {
    let core = new Core(arrPlayers)
    let controller = new Contoller(core)
    controller.catchErrors = false

    // Reset the core state for convenient testing
    // Scorpion always goes first because he is cooler
    const resetCore = () => {
        core = new Core(arrPlayers)
        controller.core = core
        controller.execute("Scorpion", "roll", {dices: [4, 2]})
        controller.execute("Sub Zero", "roll", {dices: [1, 1]})
    }

    const getTile = (idTile) => {
        return core.field.getById(idTile)
    }
    const simpleBuy = (username, tile) => controller.execute(username, "buy", {free: true, tile})

    describe("roll", () => {
        before(resetCore)

        // 10 index = jail
        // 19 index = orange_3        
        describe("main", () => {
            before(() => controller.execute("Scorpion", "roll", {dices: [6, 4]}))

            it("position changed", () => assert.equal(core.field.findPlayer("Scorpion").id, "jail"))
            it("tracker next", () => assert.equal(core.tracker.current, "Sub Zero"))
        })

        describe("special cases", () => {
            it("although the wrong player", () => {
                assert.throw(
                    () => controller.execute("Scorpion", "roll", {dices: [6, 4]}),
                    "It's not his turn now"
                )
            })
            it("roll with double", () => {
                controller.execute("Sub Zero", "roll", {dices: [5, 5]})
                assert.equal(core.tracker.current, "Sub Zero")
            })
            it("move to work tile (service)", () => {
                controller.execute("Sub Zero", "roll", {dices: [6, 3]})
                assert.equal(core.field.findPlayer("Sub Zero").id, "orange_3")
            })
        })
    })

    describe("buy", () => {
        let tile, player

        before(() => {
            resetCore()
            tile = getTile("brown_1")
            player = core.players["Scorpion"]
            player.setService("offer", tile)
            controller.execute("Scorpion", "buy")
        })

        it("money paid", () => assert.equal(player.money, 1500 - tile.price))
        it("added to player's property list", () => assert.include(player.own, "brown_1"))
        it("clear service", () => assert.isNull(player.service.offer))
        it("property added to monopoly accounting", () => assert.equal(player.monopoly.brown, 1))
        it("tile now has an owner", () => assert.equal(tile.owner, "Scorpion"))
    })

    describe("pledge", () => {
        let tile, player

        before(() => {
            resetCore()
            tile = getTile("cyan_1")
            player = core.players["Scorpion"]
            simpleBuy("Scorpion", tile)
        })

        describe("put", () => {
            before(() => controller.execute("Scorpion", "pledge", {type: "put", idTile: "cyan_1"}))

            it("money received", () => assert.equal(player.money, 1500  + tile.price / 2))
            it("tile has a flag", () => assert.isTrue(tile.pledge))
        })

        describe("redeem", () => {
            before(() => controller.execute("Scorpion", "pledge", {type: "redeem", idTile: "cyan_1"}))

            it("money paid", () => assert.equal(player.money, 1500))
            it("tile has no flag", () => assert.isFalse(tile.pledge))
        })
    })

    describe("build", () => {
        let tile1, tile2, player

        before(() => {
            resetCore()
            tile1 = getTile("blue_1")
            tile2 = getTile("blue_2")
            player = core.players["Scorpion"]
            simpleBuy("Scorpion", tile1)
            simpleBuy("Scorpion", tile2)
        })

        describe("add", () => {
            describe("one building", () => {
                before(() => controller.execute("Scorpion", "build", {type: "add", idTile: "blue_1"}))

                it("building is added", () => assert.equal(tile1.building, 1))
                it("money paid", () => assert.equal(player.money, 1500 - tile1.priceBuilding))
            })

            describe("hotel", () => {
                before(() => {
                    for (let i = 0; i < 4; i++)
                        controller.execute("Scorpion", "build", {type: "add", idTile: "blue_1"})
                })

                it("number of buildings", () => assert.equal(tile1.building, 5))
                it("hotel flag", () => assert.isTrue(tile1.hotel))
            })
        })

        describe("remove", () => {
            before(() => {
                player.money = 1500
                controller.execute("Scorpion", "build", {type: "remove", idTile: "blue_1"})
            })

            it("money received", () => assert.equal(player.money, 1500 + tile1.priceBuilding / 2))
            it("number of buildings", () => assert.equal(tile1.building, 4))
            it("hotel flag removed", () => assert.isFalse(tile1.hotel))
        })
    })

    describe("rent", () => {
        // 6 index = cyan_1
        let tile, player, owner

        before(() => {
            resetCore()
            tile = getTile("cyan_1")
            player = core.players["Scorpion"]
            owner = core.players["Sub Zero"]
            simpleBuy("Sub Zero", tile)
            controller.execute("Scorpion", "roll", {dices: [5, 1]})
            controller.execute("Scorpion", "rent")
        })

        it("player paid", () => assert.equal(player.money, 1500 - tile.rent_basic))
        it("owner received the money", () => assert.equal(owner.money, 1500 + tile.rent_basic))
        it("service cleared", () => assert.isNull(player.service.rent))
    })

    describe("sell", () => {
        let tile, player

        before(() => {
            resetCore()
            tile = getTile("brown_1")
            player = core.players["Scorpion"]
            simpleBuy("Scorpion", tile)
            controller.execute("Scorpion", "sell", {idTile: "brown_1"})
        })

        it("property has no owner", () => assert.isNull(tile.owner))
        it("money received", () => assert.equal(player.money, 1500 + tile.price))
        it("property removed from monopoly accounting", () => assert.equal(player.monopoly.brown, 0))
        it("property has been removed from the property list", () => assert.notInclude(player.own, "brown_1"))
    })

    describe("tax", () => {
        let player

        before(() => {
            resetCore()
            player = core.players["Scorpion"]
            controller.execute("Scorpion", "tax", {value: 100})
        })

        it("money paid", () => assert.equal(player.money, 1400))
    })

    describe("trade", () => {
        let playerInitiator, playerTarget
        let tile, objDeal

        before(() => {
            resetCore()
            playerInitiator = core.players["Scorpion"]
            playerTarget = core.players["Sub Zero"]
            tile = getTile("brown_1")
            simpleBuy("Scorpion", tile)
            objDeal = {
                target: "Sub Zero",
                income: ["brown_1",],
                host: [],
                moneyIncome: 0,
                moneyHost: 100,
            }
            controller.execute("Scorpion", "deal", {objDeal})
            controller.execute("Sub Zero", "trade")
        })

        it("transfer money", () => {
            assert.equal(playerInitiator.money, 1600)
            assert.equal(playerTarget.money, 1400)
        })
        it("transfer property", () => {
            assert.notInclude(playerInitiator.own, "brown_1")
            assert.include(playerTarget.own, "brown_1")
        })
        it("change owner", () => assert.equal(tile.owner, "Sub Zero"))
        it("cleaned service", () => assert.isNull(playerTarget.service.deal))
    })

    describe("cards", () => {
        let player

        const useCard = (card) => controller.execute("Scorpion", "card", {card})

        before(() => {
            resetCore()
            player = core.players["Scorpion"]
        })

        it("goTo", () => {
            useCard({type: "goTo", location: "blue_2"})
            assert.equal(core.field.findPlayer("Scorpion").id, "blue_2")
        })

        it("goToBack", () => {
            useCard({type: "goToBack", amount: 2})
            assert.equal(core.field.findPlayer("Scorpion").id, "blue_1")
        })

        it("release", () => {
            useCard({type: "release"})
            assert.equal(player.releasePrison, 1)
        })

        it("money", () => {
            useCard({type: "money", amount: 100})
            assert.equal(player.money, 1600)
        })

        it("repairBuilding", () => {
            for (let i = 1; i <= 3; i++) {
                let tile = getTile("yellow_" + i)
                simpleBuy("Scorpion", tile)
            }
            for (let i = 0; i < 5; i++)
                controller.execute("Scorpion", "build", {type: "add", free: true, idTile: "yellow_1"})

            player.money = 100
            useCard({type: "repairBuilding", amount: 50, amountHotel: 100})
            assert.equal(player.money, 0)
        })

        it("happyBirthday", () => {
            player.money = 0
            useCard({type: "happyBirthday", amount: 10})
            assert.equal(player.money, 10)
            const anotherPlayer = core.players["Sub Zero"]
            assert.equal(anotherPlayer.money, 1490)
        })

        it("arrest", () => {
            useCard({type: "arrest"})
            assert.equal(player.arrested, 3)
        })
    })
})
