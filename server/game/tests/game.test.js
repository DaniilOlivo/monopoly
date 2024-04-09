const { assert } = require("chai")

const Game = require("../index")

describe("Core game", () => {
    const game = new Game(["Scorpion", "Sub Zero"])
    game.testMode = true
    const testUsername = "Scorpion"
    const testPlayer = game.players[testUsername]

    const getDataTile = (idTile) => {
        const tile = game.field.getById(idTile)
        return [idTile, tile]
    }

    const buyForce = (username, tile) => game.buyOwn(username, {noMoney: true, directlyTile: tile})

    describe("roll", () => {
        const findPlayer = (username) => {
            const field = game.field
            const tile = field.findPlayer(username)
            return field.getIndexTile(tile)
        }

        it("set order", () => {
            game.roll([3, 4], "Scorpion")
            game.roll([2, 2], "Sub Zero")
            assert.equal(game.stage, "main")
        })

        it("move", () => {
            game.roll([4, 3], "Scorpion")
            assert.equal(findPlayer("Scorpion"), 7)
        })

        it("move with double", () => {
            game.roll([3, 3], "Sub Zero")
            game.roll([1, 2], "Sub Zero")
            assert.equal(findPlayer("Sub Zero"), 9)
        })

        after(() => {
            for (const player of Object.values(game.players)) {
                player.resetServices()
            } 
        })
    })

    describe("buy", () => {
        const [idTile, tile] = getDataTile("cyan_2")
        let result = false

        before(() => {
            testPlayer.setService("offer", tile)
            result = game.buyOwn(testUsername)
        })

        it("Buy succesful", () => assert.isTrue(result))
        it("Money paid", () => assert.equal(testPlayer.money, 1400))
        it("The player now has property", () => assert.deepEqual(testPlayer.own, [idTile]))
        it("Clear service", () => assert.isNull(testPlayer.service.offer))
        it("Property added to monopoly accounting", () => assert.equal(testPlayer.monopoly.cyan, 1))
        it("The tile now has an owner", () => assert.equal(tile.owner, testUsername))
    })

    describe("pledge", () => {
        const [idTile, tile] = getDataTile("cyan_1")

        before(() => testPlayer.money = 0)

        describe("put pledge", () => {
            let result = false
            
            before(() => {
                buyForce(testUsername, tile)
                result = game.putPledge(idTile)
            })
    
            it("Successful mortgage", () => assert.isTrue(result))
            it("Money received", () => assert.equal(testPlayer.money, 50))
            it("The tile has a flag", () => assert.isTrue(tile.pledge))
        })
    
        describe("redeem pledge", () => {
            let result = false
    
            before(() => result = game.redeemPledge(idTile))
    
            it("Successful redeem", () => assert.isTrue(result))
            it("Money paid", () => assert.equal(testPlayer.money, 0))
            it("Taking down the flag", () => assert.isFalse(tile.pledge))
        })
    }) 

    describe("building", () => {
        const [idTile, tile] = getDataTile("blue_1")
        const [, secondTile] = getDataTile("blue_2") 

        before(() => {
            buyForce(testUsername, tile)
            buyForce(testUsername, secondTile)

            testPlayer.money = 1000
        })

        describe("add building", () => {
            describe("one building", () => {
                let result = false
    
                before(() => result = game.addBuilding(idTile))
    
                it("Building added successfully", () => assert.isTrue(result))
                it("The building is added to the tile", () => assert.equal(tile.building, 1))
                it("Money paid", () => assert.equal(testPlayer.money, 800))
            })
    
            describe("hotel", () => {
                before(() => {
                    for (let i = 0; i < 4; i++) game.addBuilding(idTile)
                })
    
                it("Number of buildings", () => assert.equal(tile.building, 5))
                it("Hotel flag", () => assert.isTrue(tile.hotel))
            })
        })
    
        describe("remove building", () => {
            let result = false

            before(() => {
                testPlayer.money = 0
                result = game.removeBuilding(idTile)  
            })

            it("The building has been successfully cleaned", () => assert.isTrue(result))
            it("Money received", () => assert.equal(testPlayer.money, 100))
            it("The number of buildings has decreased", () => assert.equal(tile.building, 4))
            it("Hotel flag removed", () => assert.isFalse(tile.hotel))
        })
    })

    describe("rent", () => {
        const buy = (idTile) => {
            const [, tile] = getDataTile(idTile)
            buyForce("Sub Zero", tile)
            return tile
        }

        describe("pay rent", () => {
            const [idTile, tile] = getDataTile("violet_1")
            let result = false
            const owner = game.players["Sub Zero"]

            before(() => {
                buy(idTile)

                testPlayer.money = 10
                owner.money = 0

                testPlayer.setService("rent", { tile, cost: 10 })
                result = game.rent(testUsername)
            })

            it("Rent paid successfully", () => assert.isTrue(result))
            it("The player paid", () => assert.equal(testPlayer.money, 0))
            it("The owner received the money", () => assert.equal(owner.money, 10))
            it("Service cleared", () => assert.isNull(testPlayer.service.rent))
        })

        describe("rents for different tiles", () => {
            const checkCost = (idTile, expectVal) => {
                const [ , tile] = getDataTile(idTile)
                game.rent(testUsername, {directlyTile: tile})
                assert.equal(game.players["Sub Zero"].money, expectVal)
            }

            before(() => {
                buy("brown_1")
                buy("station_1")
                buy("electric_compamy")
            })

            beforeEach(() => {
                testPlayer.money = 1000
                game.players["Sub Zero"].money = 0
            })

            it("rent basic", () => checkCost("brown_1", 2))
            it("rent monopoly", () => {
                buy("brown_2")
                checkCost("brown_1", 4)
            })
            it("rent with building", () => {
                game.addBuilding("brown_1", {noMoney: true})
                checkCost("brown_1", 10)
            })
            it("rent with hotel", () => {
                for (let i = 0; i < 4; i++) game.addBuilding("brown_1", {noMoney: true})
                checkCost("brown_1", 250)
            })
            it("rent station", () => checkCost("station_1", 25))
            it("rent two stations", () => {
                buy("station_2")
                checkCost("station_1", 50)
            })
            it("rent communal", () => {
                game.dices = [1, 2]
                checkCost("electric_compamy", 3 * 4)
            })
            it("rent two communals", () => {
                buy("water_company")
                game.dices = [1, 2]
                checkCost("electric_compamy", 3 * 10)
            })
        })
    })

    describe("sell", () => {
        const [idTile, tile] = getDataTile("orange_1")
        let result = false

        before(() => {
            buyForce(testUsername, tile)
            testPlayer.money = 0
            result = game.sell(idTile)
        })

        it("sell succesful", () => assert.isTrue(result))
        it("Property has no owner", () => assert.isNull(tile.owner))
        it("Money received", () => assert.equal(testPlayer.money, 180))
        it("Property removed from monopoly accounting", () => assert.equal(testPlayer.monopoly.orange, 0))
        it("The property has been removed from the property list", () => assert.notInclude(testPlayer.own, idTile))
    })

    describe("tax", () => {
        let result = false

        before(() => {
            testPlayer.money = 200
            testPlayer.setService("tax", 200)
            result = game.tax(testUsername)
        })

        it("pay succesful", () => assert.isTrue(result))
        it("Money paid", () => assert.equal(testPlayer.money, 0))
    })

    describe("trade", () => {
        const initatorPlayer = game.players["Sub Zero"]
        const targetPlayer = game.players["Scorpion"]

        const arrHost = ["station_3", "station_4"]
        const [idStation1 , tileStation1] = getDataTile("station_3")
        const [ , tileStation2] = getDataTile("station_4")

        let resultDeal = false
        let resultTrade = false

        before(() => {
            game.players["Sub Zero"].money = 1500
            game.players["Scorpion"].money = 1500

            buyForce("Scorpion", tileStation1)
            buyForce("Scorpion", tileStation2)

            const objDeal = {
                target: "Scorpion",
                income: [],
                moneyIncome: 100,
                host: arrHost,
                moneyHost: 0
            }

            resultDeal = game.deal("Sub Zero", objDeal)
            resultTrade = game.trade("Scorpion")
        })

        it("valid object deal", () => assert.isTrue(resultDeal))
        it("successful trade", () => assert.isTrue(resultTrade))
        it("target received money", () => assert.equal(targetPlayer.money, 1600))
        it("initiator paid", () => assert.equal(initatorPlayer.money, 1400))
        it("target property list reduced", () => assert.notInclude(targetPlayer.own, idStation1))
        it("initiator property list has been increased", () => assert.include(initatorPlayer.own, idStation1))
        it("owner of the tile has changed", () => assert.equal(tileStation1.owner, "Sub Zero"))
        it("cleaned service", () => assert.isNull(targetPlayer.service.deal))
    })

    describe("cards", () => {
        const useCard = (card) => {
            game.effectCard(testUsername, {directlyCard: card})
        }

        it("goTo", () => { 
            useCard({type: "goTo", location: "blue_2"})
            assert.equal(game.field.findPlayer(testUsername).id, "blue_2")
        })

        it("release", () => {
            useCard({type: "release"})
            assert.equal(testPlayer.releasePrison, 1)
        })

        it("money", () => {
            testPlayer.money = 0
            useCard({type: "money", amount: 100})
            assert.equal(testPlayer.money, 100)
        })

        // it("arrest", () => {

        // })

        it("goToBack", () => {
            useCard({type: "goToBack", amount: 2})
            assert.equal(game.field.findPlayer(testUsername).id, "blue_1")
        })

        it("repairBuilding", () => {
            const fastBuy = (idTile) => {
                const [ , tile] = getDataTile(idTile)
                buyForce(testUsername, tile)
            }

            for (let i = 1; i <= 3; i++) fastBuy("yellow_" + i)
            for (let i = 0; i < 5; i++) game.addBuilding("yellow_1", {noMoney: true})

            testPlayer.money = 100
            useCard({type: "repairBuilding", amount: 50, amountHotel: 100})
            assert.equal(testPlayer.money, 0)
        })

        it("happyBirthday", () => {
            testPlayer.money = 0
            useCard({type: "happyBirthday", amount: 10})
            assert.equal(testPlayer.money, 10)
        })
    })

    describe("command", () => {
        describe("testmode", () => {
            before(() => game.command("testmode false"))
            it("testmode false", () => assert.isFalse(game.testMode))
            it("testmode true", () => {
                game.command("testmode true")
                assert.isTrue(game.testMode)
            })
        })

        describe("buy", () => {
            before(() => {
                testPlayer.money = 220
                game.command("buy Scorpion red_1")
            })

            it("property added to the player", () => assert.include(testPlayer.own, "red_1"))
            it("money paid", () => assert.equal(testPlayer.money, 0))
            it("flag no money", () => {
                game.command("buy Scorpion red_2 true")
                assert.equal(testPlayer.money, 0)
            })
        })

        describe("pledge", () => {
            const [, tile] = getDataTile("red_2")
            before(() => game.command("pledge put red_2 true"))
            it("successful pledge", () => assert.isTrue(tile.pledge))
            it("wrong action", () => assert.throw(() => game.command("pledge lol red_2"), "Wrong action"))
        })
    })
})
