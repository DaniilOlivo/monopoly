const { assert } = require("chai")

const { getConfig } = require("../utils")

describe("utils", () => {
    it("getConfig", () => {
        const result = getConfig("settings.json")
        assert.equal(result.startMoney, 1500)
    })
})
