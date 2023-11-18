const { assert } = require("chai")

const Tracker = require("../components/tracker")

describe("Component Tracker", () => {
    const listPlayers = ["Sub Zero", "Sonya Blade", "Scorpion"]
    const tracker = new Tracker(3)
    
    describe("setOrder", () => {
        it("add player", () => {
            const result = tracker.setOrder("Scorpion", 2)
            assert.isFalse(result)
            assert.isNull(tracker.current)
        })

        it("add all players", () => {
            tracker.setOrder("Sub Zero", 11)
            const result = tracker.setOrder("Sonya Blade", 5)
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
