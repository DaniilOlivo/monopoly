const { settings } = require("./utils")

const Tracker = require("./components/tracker")
const Field = require("./components/field")

const COLORS = settings["colors"]

class Game {
    constructor(usernames) {
        this.stage = "start"
        this.players = {}

        for (let i = 0; i < usernames.length; i++) {
            const username = usernames[i]
            this.players[username] = {
                color: COLORS[i],
                money: settings["startMoney"],
                own: [],
                service: {
                    offer: null
                }
            }
        }

        const listPlayers = Object.keys(this.players)

        this.tracker = new Tracker(listPlayers.length)
        this.field = new Field(listPlayers)

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
            if (tile.canBuy && !tile.owner) this.setService(currentPlayer, "offer", tile)
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

    setService(username, setting, val) {
        this.players[username].service[setting] = val
    }

    clearService(username, setting) {
        this.players[username].service[setting] = null
    }

    buyOwn(idTile, username) {
        const [tile, ] = this.field.getById(idTile)
        const price = tile.price
        const player = this.players[username]

        if (price > player.money) return [false, "Not enough money"]
        if (tile.owner) return [false, "Already has an owner"]

        player.money -= price
        tile.owner = username
        player.own.push(idTile)
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
        this.players[tile.owner].money += money
        tile.owner = null
        if (tile.pledge) tile.pledge = false
        return true
    }

    pushLog(mes, sender="system", bold=null) {
        this.logs.push({sender, mes, bold}) 
    }
}

module.exports = Game
