const { assert } = require("chai")

const Field = require("../components/field")

describe("Component Field", () => {
    const listPlayers = ["Scorpion", "SubZero", "Sonya Blade", "Kitana"]
    const usernameTest = "Scorpion"
    let field = new Field(listPlayers, "en")

    const resetField = () => field = new Field(listPlayers, "en")

    const getIndexTile = () => {
        const tile = field.findPlayer(usernameTest)
        return field.getIndexTile(tile)
    }

    describe("Create field", () => {
        it("generated id standard tiles", () => {
            const redTiles = field.tiles.filter((tile) => tile.color == "red")
            const arrId = redTiles.map((tile) => tile.id)
            assert.deepEqual(arrId, ["red_1", "red_2", "red_3"])
        })

        it("generated id type tiles", () => {
            const stationTiles = field.tiles.filter((tile) => tile.type == "station")
            const arrId = stationTiles.map((tile) => tile.id)
            assert.deepEqual(arrId, ["station_1", "station_2", "station_3", "station_4",])
        })
        
        it("area detail", () => {
            const redTile = field.tiles.find((tile) => tile.color == "red")
            const blueTile = field.tiles.find((tile) => tile.color == "blue")

            assert.equal(redTile.priceBuilding, 150)
            assert.equal(blueTile.priceBuilding, 200)
            assert.equal(redTile.numberTilesArea, 3)
            assert.equal(blueTile.numberTilesArea, 2)
        })

        it("list players on start", () => {
            const startTile = field.tiles[0]
            const secondTile = field.tiles[1]

            assert.deepEqual(startTile.players, listPlayers)
            assert.deepEqual(secondTile.players, [])
        })
    })

    describe("getById", () => {
        it("existing player", () => {
            const tile = field.getById("start")
            assert.equal(tile.id, "start")
        })

        it("non-existent player", () => {
            assert.throw(() => field.getById("red_69"), "No such tile with id red_69")
        })
    })

    describe("findPlayer", () => {
        it("existing player", () => {
            const tile = field.findPlayer(usernameTest)
            assert.equal(tile.id, "start")
        })

        it("non-existent player", () => {
            assert.throw(() => field.findPlayer("Shao Kahn"), "No such player Shao Kahn")
        })
    })

    describe("move", () => {
        afterEach(resetField)

        it("fail move", () => {
            assert.throw(() => field.move(usernameTest, -10), "Invalid index -10")
        })

        it("successful move", () => {
            const newLapBool = field.move(usernameTest, 2)
            assert.equal(getIndexTile(), 2)
            assert.isFalse(newLapBool)
        })

        it("move by new lap", () => {
            field.move(usernameTest, 20)
            const newLapBool = field.move(usernameTest, 22)
            assert.equal(getIndexTile(), 2)
            assert.isTrue(newLapBool) 
        })
    })

    describe("move by id", () => {
        afterEach(resetField)

        it("move by id", () => {
            const newLapBool = field.moveById(usernameTest, "green_1")
            assert.equal(getIndexTile(), 31)
            assert.isFalse(newLapBool)
        })

        it("move by new lap", () => {
            field.move(usernameTest, 20)
            const newLapBool = field.moveById(usernameTest, "brown_1")
            assert.equal(getIndexTile(), 1)
            assert.isTrue(newLapBool)
        })
    })
})
