const { assert } = require("chai")

const Game = require("../index")

describe("Core game", () => {
    const game = new Game(["Scorpion", "Sub Zero"])
    
    function findPlayer(username) {
        const [, indexPlayer] = game.field.findPlayer(username)
        return indexPlayer
    }

    describe("roll", () => {
        it("set order", () => {
            game.roll([3, 4], "Scorpion")
            game.roll([2, 2], "Sub Zero")
            assert.equal(game.stage, "main")
        })

        it("move", () => {
            game.roll([2, 2], "Scorpion")
            game.roll([1, 2], "Scorpion")
            assert.equal(findPlayer("Scorpion"), 7)

            game.roll([4, 5], "Sub Zero")
            assert.equal(findPlayer("Sub Zero"), 9)
        })
    })

    describe("buy", () => {
        const idTile = "cyan_2"

        it("buy succesful", () => {
            const [result, desc] = game.buyOwn(idTile, "Scorpion")
            assert.isTrue(result)
            assert.equal(desc, "Ok")
            
            const player = game.players["Scorpion"]
            assert.deepEqual(player.own, [idTile])
            assert.equal(player.monopoly.cyan, 1)

            const [tile, ] = game.field.getById(idTile)
            assert.equal(tile.owner, "Scorpion")
        })

        it("Property with its own", () => {
            const [result, desc] = game.buyOwn(idTile, "Sub Zero")
            assert.isFalse(result)
            assert.equal(desc, "Already has an owner")
        })

        it("Not enough money", () => {
            game.players["Sub Zero"].money = 0
            const [result, desc] = game.buyOwn("cyan_1", "Sub Zero")
            assert.isFalse(result)
            assert.equal(desc, "Not enough money")
        })
    })

    describe("put pledge", () => {
        const idTile = "cyan_1"
        
        before(() => {
            game.players["Sub Zero"].money = 1500
            game.buyOwn(idTile, "Sub Zero")
        })

        it("pledge succesful", () => {
            const result = game.putPledge(idTile)
            assert.isTrue(result)
            assert.equal(game.players["Sub Zero"].money, 1450)

            const [tile, ] = game.field.getById(idTile)
            assert.isTrue(tile.pledge)
        })

        it("no owner", () => {
            const result = game.putPledge("cyan_3")
            assert.isFalse(result)
        })
    })

    describe("redeem pledge", () => {
        it("redeem succesful", () => {
            const [result, desc] = game.redeemPledge("cyan_1")
            assert.isTrue(result)
            assert.equal(desc, "Ok")

            const [tile, ] = game.field.getById("cyan_1")
            assert.isFalse(tile.pledge)

            assert.equal(game.players["Sub Zero"].money, 1400)
        })

        it("redeem fail", () => {
            const attemptRedeem = (idTile, expectDesc) => {
                const [result, desc] = game.redeemPledge(idTile)
                assert.isFalse(result)
                assert.equal(desc, expectDesc)
            }
            attemptRedeem("cyan_3", "Property with its own")
            attemptRedeem("cyan_1", "Is not in collateral")
            game.putPledge("cyan_1")
            game.players["Sub Zero"].money = 0 
            attemptRedeem("cyan_1", "Not enough money")
        })
    })

    describe("add building", () => {
        const setMoney = (money) => game.players["Scorpion"].money = money

        before(() => {
            setMoney(1500)
            game.buyOwn("red_1", "Scorpion")
            game.buyOwn("blue_1", "Scorpion")
            game.buyOwn("blue_2", "Scorpion")

            // for simple calculations
            setMoney(2000)
        })

        it("wrong type", () => {
            const [result, desc] = game.addBuilding("station_1")
            assert.isFalse(result)
            assert.equal(desc, "Wrong type")
        })

        it("adding a building without a monopoly", () => {
            const [result, desc] = game.addBuilding("red_1")
            assert.isFalse(result)
            assert.equal(desc, "No monopoly in this color")
        })

        it("one building", () => {
            const [result, desc] = game.addBuilding("blue_1")
            assert.isTrue(result)
            assert.equal(desc, "Ok")

            const [tile, ] = game.field.getById("blue_1")
            assert.equal(tile.building, 1)
            assert.equal(game.players["Scorpion"].money, 1800)
        })

        it("hotel", () => {
            for (let i = 0; i < 4; i++) game.addBuilding("blue_1")
            const [tile, ] = game.field.getById("blue_1")
            assert.equal(tile.building, 5)
            assert.isTrue(tile.hotel)
        })

        it("not enough money", () => {
            setMoney(0)
            const [result, desc] = game.addBuilding("blue_2")
            assert.isFalse(result)
            assert.equal(desc, "Not enough money")
        })
    })

    describe("remove building", () => {
        it("one building remove", () => {
            game.removeBuilding("blue_1")
            const player = game.players["Scorpion"]
            const [tile, ] = game.field.getById("blue_1")
            assert.equal(player.money, 100)
            assert.equal(tile.building, 4)
            assert.isFalse(tile.hotel)
        })
    })

    describe("rent", () => {
        const checkCost = (tileId, expectCost) => {
            const cost = game.getRent(tileId)
            assert.equal(cost, expectCost)
        }

        before(() => {
            game.players["Scorpion"].money = 2000

            game.buyOwn("orange_1", "Scorpion")
            game.buyOwn("orange_2", "Scorpion")
            game.buyOwn("station_1", "Scorpion")
            game.buyOwn("electric_compamy", "Scorpion")

            game.players["Scorpion"].money = 2000
        })

        it("rent basic", () => {
            checkCost("orange_1", 14)
        })

        it("rent monopoly", () => {
            game.buyOwn("orange_3", "Scorpion")
            checkCost("orange_1", 28)
        })

        it("rent with building", () => {
            game.addBuilding("orange_1")
            checkCost("orange_1", 70)
        })

        it("rent with hotel", () => {
            for (let i = 0; i < 4; i++) {
                game.addBuilding("orange_1")
            }
            checkCost("orange_1", 950)
        })

        it("rent station", () => {
            checkCost("station_1", 25)
        })

        it("rent two stations", () => {
            game.buyOwn("station_2", "Scorpion")
            checkCost("station_1", 50)
        })

        it("rent communal", () => {
            game.roll([1,2], "Sub Zero")
            checkCost("electric_compamy", 3 * 4)
        })

        it("rent two communals", () => {
            game.buyOwn("water_company", "Scorpion")
            checkCost("electric_compamy", 3 * 10)
        })
    })

    describe("sell", () => {
        before(() => {
            game.players["Sub Zero"].money = 0
        })

        it("sell succesful", () => {
            const result = game.sell("cyan_1")
            assert.isTrue(result)
            const [tile, ] = game.field.getById("cyan_1")
            assert.isNull(tile.owner)
            const player = game.players["Sub Zero"]
            assert.equal(player.money, 50)
            assert.equal(player.own.length, 0)
            assert.equal(player.monopoly.cyan, 0)
        })

        it("sell fail", () => {
            const result = game.sell("cyan_1")
            assert.isFalse(result)
        })
    })
})
