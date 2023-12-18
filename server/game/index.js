const { settings } = require("./utils")

const Tracker = require("./components/tracker")
const Field = require("./components/field")
const Player = require("./components/player")

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
                settings["startMoney"],
                this.field.tiles
            )
        }

        this.dices = [4, 2]

        this.logs = []
    }

    setOrderPlayer(username, dices) {
        const result = this.tracker.setOrder(username, dices)
        if (result) this.stage = "main"
    }

    rollStandard(dices) {
        const currentPlayer = this.tracker.current
        this.dices = dices
        const [val1, val2] = dices 
        const [ok, circle] = this.field.move(currentPlayer, val1 + val2)
        if (ok) {
            if (circle) this.players[currentPlayer].money += 200
            const [tile, ] = this.field.findPlayer(currentPlayer)
            this.pushLog("ends up on the", currentPlayer, tile.title)
            if (tile.canBuy && !tile.owner) {
                this.players[currentPlayer].setService("offer", tile)
            }
            else this.next()
        }
    }

    roll(dices, username) {
        this.pushLog("roll dices with meaning", username, dices.toString())
        if (this.stage == "start") this.setOrderPlayer(username, dices)
        else this.rollStandard(dices)
    }

    next() {
        const [val1, val2] = this.dices
        if (val1 == val2) return false
        else {
            this.tracker.next()
            return true
        }
    }

    buyOwn(idTile, username) {
        const [tile, ] = this.field.getById(idTile)
        const price = tile.price
        const player = this.players[username]

        if (price > player.money) return [false, "Not enough money"]
        if (tile.owner) return [false, "Already has an owner"]

        player.money -= price
        player.addOwn(tile)
        this.pushLog("buys", username, tile.title)
        return [true, "Ok"]
    }

    putPledge(idTile) {
        const [tile, ] = this.field.getById(idTile)
        const owner = tile.owner
        if (!owner || tile.pledge) return false
        tile.pledge = true
        this.players[owner].money += tile.price / 2
        return true
    }

    redeemPledge(idTile) {
        const [tile, ] = this.field.getById(idTile)
        const cost = tile.price / 2
        
        if (!tile.owner) return [false, "Property with its own"]
        const player = this.players[tile.owner]
        if (!tile.pledge) return [false, "Is not in collateral"]
        if (player.money < cost) return [false, "Not enough money"]

        player.money -= cost
        tile.pledge = false

        return [true, "Ok"]
    }

    sell(idTile) {
        const [tile, ] = this.field.getById(idTile)
        if (!tile.owner) return false
        const money = (tile.pledge) ? tile.price / 2 : tile.price
        const player = this.players[tile.owner]
        player.money += money
        player.removeOwn(tile)
        if (tile.pledge) tile.pledge = false
        return true
    }

    addBuilding(idTile) {
        const [tile, ] = this.field.getById(idTile)
        const color = tile.color
        const player = this.players[tile.owner]

        if (!color) return [false, "Wrong type"]
        if (player.monopoly[color] != tile.count) return [false, "No monopoly in this color"] 
        
        const cost = tile.priceBuilding
        if (cost > player.money) return [false, "Not enough money"]

        player.money -= cost
        tile.addBuilding()
        return [true, "Ok"]
    }

    removeBuilding(idTile) {
        const [tile, ] = this.field.getById(idTile)
        const player = this.players[tile.owner]
        
        player.money += tile.priceBuilding / 2
        tile.removeBuilding()
    }

    pushLog(mes, sender="system", bold=null) {
        this.logs.push({sender, mes, bold}) 
    }
}

module.exports = Game
