const { assert } = require("chai")

const Field = require("../components/field")

describe("Component Field", () => {
    const listPlayers = ["Scorpion", "SubZero", "Sonya Blade", "Kitana"]
    const player = "Scorpion"
    let field = new Field(listPlayers)

    describe("Create field", () => {
        it("Generated id standard tiles", () => {
            const redTiles = field.tiles.filter((tile) => tile.color == "red")
            const arrId = redTiles.map((tile) => tile.id)
            assert.deepEqual(arrId, ["red_1", "red_2", "red_3"])
        })

        it("Generated id type tiles", () => {
            const stationTiles = field.tiles.filter((tile) => tile.type == "station")
            const arrId = stationTiles.map((tile) => tile.id)
            assert.deepEqual(arrId, ["station_1", "station_2", "station_3", "station_4",])
        })
        
        it("Add price building", () => {
            const redTile = field.tiles.find((tile) => tile.color == "red")
            const blueTile = field.tiles.find((tile) => tile.color == "blue")

            assert.equal(redTile.price_building, 150)
            assert.equal(blueTile.price_building, 200)
        })

        it("Add players", () => {
            const startTile = field.tiles[0]
            const secondTile = field.tiles[1]

            assert.deepEqual(startTile.players, listPlayers)
            assert.deepEqual(secondTile.players, [])
        })

        it("getById", () => {
            const [tile, index] = field.getById("cyan_2")
            assert.equal(tile.title, "Euston Road")
            assert.equal(index, 8)
        })
    })

    describe("findPlayer", () => {
        it("Search for an existing player", () => {
            const [tile, index] = field.findPlayer(player)
            assert.equal(tile.id, "start")
            assert.equal(index, 0)
        })

        it("Search for a non-existent player", () => {
            const [tile, index] = field.findPlayer("Shao Kahn")
            assert.isUndefined(tile)
            assert.equal(index, -1)
        })
    })

    describe("replacePlayer", () => {
        afterEach(() => {
            field = new Field(listPlayers)
        })

        it("incorrect index", () => {
            const result = field.replacePlayer(player, 42)
            assert.isFalse(result)
        })

        it("delete player", () => {
            const result = field.replacePlayer(player, -1)
            assert.isTrue(result)
            const [tile] = field.findPlayer(player)
            assert.isUndefined(tile)
        })

        it("replace player", () => {
            const result = field.replacePlayer(player, 10)
            assert.isTrue(result)
            const [ , index] = field.findPlayer(player)
            assert.equal(index, 10)
        })
    })

    describe("move", () => {
        afterEach(() => {
            field = new Field(listPlayers)
        })

        it("fail move", () => {
            const [result] = field.move("Shao Kahn", 10)
            assert.isFalse(result)
        })

        it("successful move", () => {
            const [result, newCircle] = field.move(player, 2)
            assert.isTrue(result)
            const [ , index] = field.findPlayer(player)
            assert.equal(index, 2)
            assert.isFalse(newCircle)
        })

        it("move by new circle", () => {
            field.move(player, 20)
            const [result, newCircle] = field.move(player, 22)
            assert.isTrue(result)
            assert.isTrue(newCircle)
            const [ , index] = field.findPlayer(player)
            assert.equal(index, 2)  
        })
    })
})
