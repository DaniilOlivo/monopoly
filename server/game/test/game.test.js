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
})
