const { settings, getConfig } = require("./utils")

const Tracker = require("./components/tracker")
const Field = require("./components/field")
const Player = require("./components/player")
const Cards = require("./components/cards")

const COLORS = settings["colors"]

class Game {
    constructor(usernames) {
        this.stage = "start"
        this.players = {}

        this.tracker = new Tracker(usernames.length)
        this.field = new Field(usernames)

        for (let i = 0; i < usernames.length; i++) {
            const username = usernames[i]
            this.players[username] = new Player(
                username,
                COLORS[i],
                settings["startMoney"]
            )
        }

        this.dices = [4, 2]

        this.logs = []

        // If test mode is running, logical errors in the game core will cause exceptions
        // Otherwise errors will be added to the log
        this.testMode = false

        this.chests = new Cards(getConfig("chest.json"), "chests")
        this.chance = new Cards(getConfig("chance.json"), "chance")
    }

    // =================================================================
    // System methods    
    _checkUsername(username) {
        const listPlayers = Object.values(this.players).map(p => p.username)
        return listPlayers.includes(username)
    }

    _checkIdTile(idTile) {
        const tiles = this.field.tiles
        return tiles.map(tile => tile.id).includes(idTile)
    }

    _checkValidObjDeal(obj) {
        const { initiator, target, income, host, moneyIncome, moneyHost } = obj
        return (
            income &&
            host &&
            moneyIncome >= 0 &&
            moneyHost >= 0 &&
            this._checkUsername(initiator) &&
            this._checkUsername(target) 
        )
    }

    _setOrderPlayer(username, dices) {
        const result = this.tracker.setOrder(username, dices)
        if (result) this.stage = "main"
    }

    _getRent(idTile) {
        const tile = this.field.getById(idTile)

        const playerOwner = this.players[tile.owner]
        let cost = 0

        if (tile.color) {
            cost = tile.rent_basic
            if (playerOwner.monopoly[tile.color] == tile.numberTilesArea) cost = tile.rent_basic * 2
            if (tile.building > 0 && tile.building < 5) cost = tile[`rent_${tile.building}_house`]
            if (tile.hotel) cost = tile.rent_hotel
        }

        if (tile.type == "station") {
            const numberStations = playerOwner.monopoly[tile.type]
            cost = 25 * 2**(numberStations - 1)
        }

        if (tile.type == "communal") {
            const mod = (playerOwner.monopoly[tile.type] == 2) ? 10 : 4
            const [val1, val2] = this.dices
            cost = (val1 + val2) * mod
        }

        return cost
    }

    _rollStandard(dices) {
        const usernamePlayer = this.tracker.current
        this.dices = dices
        const [val1, val2] = dices
        const player = this.players[usernamePlayer]

        const newLapBool = this.field.move(usernamePlayer, val1 + val2)
        if (newLapBool) player.money += settings["lapMoney"]
        const tile = this.field.findPlayer(usernamePlayer)
        this.pushLog("ends up on the", usernamePlayer, tile.title)

        if (tile.canBuy) {
            if (!tile.owner) player.setService("offer", tile)
            else if (tile.owner != usernamePlayer && !tile.pledge) {
                player.setService("rent", {tile, cost: this._getRent(tile.id)})
            }
            else this.next()
        } else if (tile.type == "tax") {
            player.setService("tax", tile.cost)
        } else if (["community_chest", "chance"].includes(tile.type)) {
            const deck = tile.type == "chance" ? this.chance : this.chests
            player.setService("card", deck.get())
        }
        else this.next()
    }

    // =================================================================
    // Main methods
    roll(dices, username) {
        this.pushLog("roll dices with meaning", username, dices.toString())
        if (this.stage == "start") this._setOrderPlayer(username, dices)
        else this._rollStandard(dices)
        return this.stage
    }

    next() {
        const [val1, val2] = this.dices
        if (val1 == val2) return false
        else {
            this.tracker.next()
            return true
        }
    }

    pushLog(mes, sender="system", bold=null) {
        this.logs.push({sender, mes, bold}) 
    }

    pushError(mes, bold=null) {
        this.pushLog(mes, "error", bold)
    }

    error(mes, detail=null) {
        let textError = mes
        if (detail) textError = mes + ": " + detail
        if (this.testMode) throw new Error(textError)
        else this.pushError(mes, detail)
    }

    // Special method for special developer commands
    command(commandString) {
        const parseBool = (valString) => valString == "true"
        const parseUsername = (username) => {
            const elementsUsername = username.split("_")
            if (elementsUsername.length == 1) return username
            else return elementsUsername.join(" ")
        }

        const splitString = commandString.split(" ")
        const command = splitString[0]
        const args = splitString.slice(1)

        if (command == "testmode") {
            const [val] = args
            this.testMode = parseBool(val)
        }

        if (command == "buy") {
            const [systemUsername, idTile, noMoney] = args

            const username = parseUsername(systemUsername)
            if (!this._checkUsername(username)) return this.error("Wrong username", username)
            if (!this._checkIdTile(idTile)) return this.error("Wrong id tile", idTile)

            const tile = this.field.getById(idTile)
            this.buyOwn(username, {noMoney: parseBool(noMoney), directlyTile: tile})
        }

        if (command == "pledge") {
            const [action, idTile, noMoney] = args

            if (!this._checkIdTile(idTile)) return this.error("Wrong id tile", idTile)

            const options = { noMoney: parseBool(noMoney) }
            if (action == "put") this.putPledge(idTile, options)
            else if (action == "redeem") this.redeemPledge(idTile, options)
            else return this.error("Wrong action", action)
        }

        if (command == "build") {
            const [action, idTile, noMoney] = args

            if (!this._checkIdTile(idTile)) return this.error("Wrong id tile", idTile)

            const options = { noMoney: parseBool(noMoney) }
            if (action == "add") this.addBuilding(idTile, options)
            else if (action == "remove") this.removeBuilding(idTile, options)
            else return this.error("Wrong action", action)
        }

        if (command == "sell") {
            const [idTile, noMoney] = args

            if (!this._checkIdTile(idTile)) return this.error("Wrong id tile", idTile)

            this.sell(idTile, { noMoney: parseBool(noMoney) })
        }

        if (command == "money") {
            const [systemUsername, value] = args

            const username = parseUsername(systemUsername)
            let valuerNumber = parseInt(value)

            if (!this._checkUsername(username)) return this.error("Wrong username", username)
            if (Number.isNaN(valuerNumber)) return this.error("Value must be an integer", value)

            const player = this.players[username]
            player.money += valuerNumber
        }

        if (command == "move") {
            const [systemUsername, idTile] = args

            const username = parseUsername(systemUsername)

            if (!this._checkUsername(username)) return this.error("Wrong username", username)
            if (!this._checkIdTile(idTile)) return this.error("Wrong id tile", idTile)

            const tile = this.field.getById(idTile)
            const index = this.field.getIndexTile(tile)
            this.field.replacePlayer(username, index)
        }
    }

    // =================================================================
    // Services methods
    ping(username) {
        this.pushLog("ping", username)
        return true
    }

    buyOwn(username, options={}) {
        const { noMoney, directlyTile, clearService } = options

        const player = this.players[username]
        if (clearService) {
            player.clearService("offer")
            return true
        }
        let tile = player.service.offer
        if (directlyTile) tile = directlyTile 
        let price = tile.price
        if (noMoney) price = 0

        if (!tile) return this.error("There is no offer for this tile", tile.id)
        if (!tile.canBuy) return this.error("This tile cannot be bought", tile.id)
        if (price > player.money) return this.error("The player does not have enough money", username)
        if (tile.owner) return this.error("Already has an owner", tile.owner)

        player.money -= price
        player.addOwn(tile)
        player.clearService("offer")
        this.pushLog("buys", username, tile.title)
        return true
    }

    putPledge(idTile, options={}) {
        const { noMoney } = options

        const tile = this.field.getById(idTile)
        const owner = tile.owner

        if (!owner) return this.error("Property has no owner", idTile)
        if (tile.pledge) return this.error("The property is already mortgaged", idTile)

        tile.pledge = true
        this.players[owner].money += noMoney ? 0 : tile.price / 2
        return true
    }

    redeemPledge(idTile, options={}) {
        const { noMoney } = options

        const tile = this.field.getById(idTile)
        const cost = noMoney ? 0 : tile.price / 2
        const owner = tile.owner
        
        if (!owner) return this.error("Property has no owner", idTile)
        if (!tile.pledge) return this.error("The property is not mortgaged", idTile)

        const player = this.players[owner]
        if (player.money < cost) return this.error("The player does not have enough money", username)

        player.money -= cost
        tile.pledge = false

        return true
    }

    addBuilding(idTile, options = {}) {
        const { noMoney } = options

        const tile = this.field.getById(idTile)
        const color = tile.color
        const owner = tile.owner

        if (!owner) return this.error("Property has no owner", idTile)
        if (!color) return this.error("You can't build buildings", idTile)

        const player = this.players[owner]
        if (player.monopoly[color] != tile.numberTilesArea) {
            return this.error("There is no monopoly on this area", idTile)
        }
        
        const cost = noMoney ? 0 : tile.priceBuilding
        if (cost > player.money) return this.error("The player does not have enough money", username)

        player.money -= cost
        tile.addBuilding()
        return true
    }

    removeBuilding(idTile, options = {}) {
        const { noMoney } = options

        const tile = this.field.getById(idTile)
        const owner = tile.owner

        if (!owner) return this.error("Property has no owner", idTile)

        const player = this.players[owner]
        
        player.money += noMoney ? 0 : tile.priceBuilding / 2
        tile.removeBuilding()
        return true
    }

    rent(username, options={}) {
        let { noMoney, directlyTile } = options

        const player = this.players[username]

        if (directlyTile) directlyTile = {tile: directlyTile, cost: this._getRent(directlyTile.id)}
        const { tile, cost } = directlyTile ?? player.service.rent
        if (!tile) return this.error("The player does not owe rent to anyone", username)
        let price = noMoney ? 0 : cost

        if (!tile.owner) return this.error("Property has no owner", tile.id)
        if (price > player.money) return this.error("The player does not have enough money", username)

        const owner = this.players[tile.owner]

        player.money -= price
        owner.money += price
        player.clearService("rent")

        this.pushLog("pays rent", username, price + " M.")

        return true
    }

    sell(idTile, options={}) {
        const { noMoney } = options
        const tile = this.field.getById(idTile)
        if (!tile.owner) return this.error("Property has no owner", tile.id)
        let money = (tile.pledge) ? tile.price / 2 : tile.price
        if (noMoney) money = 0
        const player = this.players[tile.owner]
        player.money += money
        player.removeOwn(tile)
        if (tile.pledge) tile.pledge = false
        return true
    }

    tax(username, options={}) {
        const { directlyTax } = options
        const player = this.players[username]
        const cost = directlyTax ?? player.service.tax

        if (!cost) return this.error("The player has no tax", username)
        if (cost > player.money) return this.error("The player does not have enough money", username)
        
        player.money -= cost
        player.clearService("tax")
        this.pushLog("pays", username, cost + " M.")
        return true
    }

    deal(username, objDeal) {
        objDeal.initiator = username
        const target = objDeal.target
        if (!this._checkValidObjDeal(objDeal)) return this.error("Invalid object deal", JSON.stringify(objDeal))
        this.players[target].setService("deal", objDeal)
        return true
    }

    trade(username, options={}) {
        const { clearService } = options

        const targetPlayer = this.players[username]

        if (clearService) {
            targetPlayer.clearService("deal")
            return true
        }

        const objDeal = this.players[username].service.deal
        if (!this._checkValidObjDeal(objDeal)) return this.error("Invalid object deal", JSON.stringify(objDeal))
        const initiatorPlayer = this.players[objDeal.initiator]

        this.pushLog("made a deal", objDeal.initiator, username)

        const swapMoney = (fromPlayer, toPlayer, value) => {
            fromPlayer.money -= value
            toPlayer.money += value
        }

        for (const idTile of objDeal.income) {
            const tile = this.field.getById(idTile)
            initiatorPlayer.transfer(tile, targetPlayer)
            this.pushLog("receives property", username, tile.title)
        }
        swapMoney(initiatorPlayer, targetPlayer, objDeal.moneyIncome)

        for (const idTile of objDeal.host) {
            const tile = this.field.getById(idTile)
            targetPlayer.transfer(tile, initiatorPlayer)
            this.pushLog("receives property", objDeal.initiator, tile.title)
        }
        swapMoney(targetPlayer, initiatorPlayer, objDeal.moneyHost)

        if (objDeal.moneyHost > 0) this.pushLog("receives money", objDeal.initiator, objDeal.moneyHost + " M.")
        if (objDeal.moneyIncome > 0) this.pushLog("receives money", username, objDeal.moneyIncome + " M.")

        targetPlayer.clearService("deal")

        return true
    }

    effectCard(username, options={}) {
        const { directlyCard } = options

        const player = this.players[username]
        const card = directlyCard ?? player.service.card
        if (!card) return this.error("The player has no card", username)

        const mapCards = {
            goTo: () => {
                const tileTarget = this.field.getById(card.location)
                const indexTile = this.field.getIndexTile(tileTarget)

                const tilePlayer = this.field.findPlayer(username)
                const indexTilePlayer = this.field.getIndexTile(tilePlayer)

                this.field.replacePlayer(username, indexTile)

                if (indexTile < indexTilePlayer) player.money += 200
            },
            release: () => player.releasePrison += 1,
            money: () => player.money += card.amount,
            goToBack: () => this.field.move(username, -card.amount),
            repairBuilding: () => {
                let cost = 0
                for (const idTile of player.own) {
                    const tile = this.field.getById(idTile)
                    if (tile.type == "standard") {
                        if (tile.hotel) cost += card.amountHotel
                        else cost += tile.building * card.amount
                    }
                }
                player.money -= cost
            },
            happyBirthday: () => player.money += (Object.keys(this.players).length - 1) * card.amount
        }

        const type = card.type
        if (!(type in mapCards)) return this.error("Not found card type", type)

        mapCards[type]()
        player.clearService("card")

        return true
    }
}

module.exports = Game
