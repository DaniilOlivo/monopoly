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
            game.next()

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

    it("sell", () => {
        it("sell succesful", () => {
            const result = game.sell("cyan_1")
            assert.isTrue(result)
            const [tile, ] = game.field.getById("cyan_1")
            assert.isNull(tile.owner)
            assert.equal(game.players["Sub Zero"].money, 100)
        })

        it("sell fail", () => {
            const result = game.sell("cyan_1")
            assert.isFalse(result)
        })
    })
})
