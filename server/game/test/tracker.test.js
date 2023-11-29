const { assert } = require("chai")

const Tracker = require("../components/tracker")

describe("Component Tracker", () => {
    const listPlayers = ["Sub Zero", "Sonya Blade", "Scorpion"]
    const tracker = new Tracker(3)
    
    describe("setOrder", () => {
        it("add player", () => {
            const result = tracker.setOrder("Scorpion", [1, 1])
            assert.isFalse(result)
            assert.isNull(tracker.current)
        })

        it("add all players", () => {
            tracker.setOrder("Sub Zero", [6, 5])
            const result = tracker.setOrder("Sonya Blade", [3, 2])
            assert.isTrue(result)
            assert.equal(tracker.current, "Sub Zero")
            assert.deepEqual(tracker.order, listPlayers)
        })
    })

    describe("next", () => {
        it("next player", () => {
            const current = tracker.next()
            assert.equal(current, "Sonya Blade")
        })

        it("new round", () => {
            tracker.next()
            const current = tracker.next()
            assert.equal(current, "Sub Zero")
        })
    })
})
