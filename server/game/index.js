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
            if (tile.canBuy) {
                if (!tile.owner) this.players[currentPlayer].setService("offer", tile)
                else if (tile.owner != currentPlayer) {
                    const cost = this.getRent(tile.id)
                    this.players[currentPlayer].setService("rent", {cost, tile})
                }
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

    getRent(idTile) {
        const [tile, ] = this.field.getById(idTile)

        if (!tile.canBuy) return false

        const playerOwner = this.players[tile.owner]
        let cost = 0

        if (tile.color) {
            cost = tile.rent_basic
            if (playerOwner.monopoly[tile.color] == tile.count) cost = tile.rent_basic * 2
            if (tile.building > 0 && tile.building < 5) cost = tile[`rent_${tile.building}_house`]
            if (tile.hotel) cost = tile.rent_hotel
        }

        if (tile.type == "station") {
            cost = tile.rent[playerOwner.monopoly[tile.type] - 1]
        }

        if (tile.type == "communal") {
            const mod = (playerOwner.monopoly[tile.type] == 2) ? 10 : 4
            const [val1, val2] = this.dices
            cost = (val1 + val2) * mod
        }

        return cost
    }

    rent(username) {
        const player = this.players[username]
        const {cost, tile} = player.service.rent
        const owner = this.players[tile.owner]

        if (cost > player.money) return false
        player.money -= cost
        owner.money += cost

        this.pushLog("pays rent", username, cost + " M.")

        return true
    }

    offerDeal(initiator, target, arrIncoming, arrHost, moneyIncome, moneyHost) {
        this.players[target].setService("deal", {
            initiator,
            income: arrIncoming,
            host: arrHost,
            moneyIncome, moneyHost
        })
    }

    trade(username) {
        const targetPlayer = this.players[username]
        const objDeal = this.players[username].service.deal
        const initiatorPlayer = this.players[objDeal.initiator]

        const swapMoney = (fromPlayer, toPlayer, value) => {
            fromPlayer.money -= value
            toPlayer.money += value
        }

        const swapOwn = (fromPlayer, toPlayer, idTile) => {
            const arrOwn = fromPlayer.own
            arrOwn.splice(arrOwn.indexOf(idTile), 1)

            toPlayer.own.push(idTile)
            const [tile, ] = this.field.getById(idTile)
            tile.owner = toPlayer.username
        }

        for (const idTile of objDeal.income) {
            swapOwn(initiatorPlayer, targetPlayer, idTile)
        }
        swapMoney(initiatorPlayer, targetPlayer, objDeal.moneyIncome)

        for (const idTile of objDeal.host) {
            swapOwn(targetPlayer, initiatorPlayer, idTile)
        }
        swapMoney(targetPlayer, initiatorPlayer, objDeal.moneyHost)

        targetPlayer.clearService("deal")
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
