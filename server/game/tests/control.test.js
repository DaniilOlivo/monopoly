const { assert } = require('chai')

const Core = require("../index")
const Control = require("../control")

const arrPlayers = ["Scorpion", "Sub Zero"]

function createControl(core, username) {
    const control = new Control(core, username)
    control.testMode = true
    return control
}

describe("Start game", () => {
    let core = new Core(arrPlayers)
    let controlScorpion = createControl(core, "Scorpion")
    let controlSubZero = createControl(core, "Sub Zero")


    before(() => {
        controlScorpion.use("roll", {dices: [2, 2]})
        controlSubZero.use("roll", {dices: [3, 4]})
    })

    it("players order", () => assert.deepEqual(core.tracker.order, ["Sub Zero", "Scorpion"]))
    it("change stage", () => assert.equal(core.stage, "main"))
})

describe("Control methods", () => {
    let core = new Core(arrPlayers)

    let controlScorpion = createControl(core, "Scorpion")
    let controlSubZero = createControl(core, "Sub Zero")

    // Reset the core state for convenient testing
    // Scorpion always goes first because he is cooler
    const resetCore = () => {
        core = new Core(arrPlayers)
        controlScorpion.core = core
        controlSubZero.core = core

        controlScorpion.use("roll", {dices: [4, 2]})
        controlSubZero.use("roll", {dices: [1, 1]})
    }

    const getTile = (idTile) => {
        return core.field.getById(idTile)
    }

    const simpleBuy = (control, tile) => control.use("buy", {free: true, tile})

    describe("roll", () => {
        before(resetCore)

        // 10 index = jail
        // 19 index = orange_3        
        describe("main", () => {
            before(() => controlScorpion.use("roll", {dices: [6, 4]}))

            it("position changed", () => assert.equal(core.field.findPlayer("Scorpion").id, "jail"))
            it("tracker next", () => assert.equal(core.tracker.current, "Sub Zero"))
        })

        describe("special cases", () => {
            it("although the wrong player", () => {
                assert.throw(
                    () => controlScorpion.use("roll", {dices: [6, 4]}),
                    "It's not his turn now"
                )
            })
            it("roll with double", () => {
                controlSubZero.use("roll", {dices: [5, 5]})
                assert.equal(core.tracker.current, "Sub Zero")
            })
            it("move to work tile (service)", () => {
                controlSubZero.use("roll", {dices: [6, 3]})
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
            controlScorpion.use("buy")
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
            simpleBuy(controlScorpion, tile)
        })

        describe("put", () => {
            before(() => controlScorpion.use("pledge", {type: "put", idTile: "cyan_1"}))

            it("money received", () => assert.equal(player.money, 1500  + tile.price / 2))
            it("tile has a flag", () => assert.isTrue(tile.pledge))
        })

        describe("redeem", () => {
            before(() => controlScorpion.use("pledge", {type: "redeem", idTile: "cyan_1"}))

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
            simpleBuy(controlScorpion, tile1)
            simpleBuy(controlScorpion, tile2)
        })

        describe("add", () => {
            describe("one building", () => {
                before(() => controlScorpion.use("build", {type: "add", idTile: "blue_1"}))

                it("building is added", () => assert.equal(tile1.building, 1))
                it("money paid", () => assert.equal(player.money, 1500 - tile1.priceBuilding))
            })

            describe("hotel", () => {
                before(() => {
                    for (let i = 0; i < 4; i++)
                        controlScorpion.use("build", {type: "add", idTile: "blue_1"})
                })

                it("number of buildings", () => assert.equal(tile1.building, 5))
                it("hotel flag", () => assert.isTrue(tile1.hotel))
            })
        })

        describe("remove", () => {
            before(() => {
                player.money = 1500
                controlScorpion.use("build", {type: "remove", idTile: "blue_1"})
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
            simpleBuy(controlSubZero, tile)
            controlScorpion.use("roll", {dices: [5, 1]})
            controlScorpion.use("rent")
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
            simpleBuy(controlScorpion, tile)
            controlScorpion.use("sell", {idTile: "brown_1"})
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
            controlScorpion.use("tax", {value: 100})
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
            simpleBuy(controlScorpion, tile)
            objDeal = {
                target: "Sub Zero",
                income: ["brown_1",],
                host: [],
                moneyIncome: 0,
                moneyHost: 100,
            }
            controlScorpion.use("deal", {objDeal})
            controlSubZero.use("trade")
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

        const useCard = (card) => controlScorpion.use("card", {card})

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
                simpleBuy(controlScorpion, tile)
            }
            for (let i = 0; i < 5; i++)
                controlScorpion.use("build", {type: "add", free: true, idTile: "yellow_1"})

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
