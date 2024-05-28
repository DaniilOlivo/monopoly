const { settings, getConfig } = require("./utils")

const Tracker = require("./components/tracker")
const Field = require("./components/field")
const Player = require("./components/player")
const Cards = require("./components/cards")

const COLORS = settings["colors"]

class Game {
    constructor(usernames) {
        this.stage = "start"
        this.winner = null
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

        // Required for dice throwing animation
        this.lastAction = ""

        this.chests = new Cards(getConfig("chest.json"), "chests")
        this.chance = new Cards(getConfig("chance.json"), "chance")
    }

    getRent(idTile) {
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

    getRepairBuilding(player, card) {
        let cost = 0
        for (const idTile of player.own) {
            const tile = this.field.getById(idTile)
            if (tile.type == "standard") {
                if (tile.hotel) cost += card.amountHotel
                else cost += tile.building * card.amount
            }
        }

        return cost
    }

    getCapital(username) {
        const player = this.players[username]
        let capital = player.money

        for (const tileId of player.own) {
            const tile = this.field.getById(tileId)
            capital += tile.pledge ? tile.price / 2 : tile.price
            if (tile.building) {
                capital += tile.building * (tile.priceBuilding / 2)
            }
        }

        return capital
    }

    dispathTile(tile, username) {
        const player = this.players[username]
        let mustPay = 0
        
        if (tile.canBuy) {
            if (!tile.owner) player.setService("offer", tile)
            else if (tile.owner != username && !tile.pledge) {
                const cost = this.getRent(tile.id)
                player.setService("rent", {tile, cost})
                mustPay += cost
            }
            else this.next()
        } else if (tile.type == "tax") {
            player.setService("tax", tile.cost)
            mustPay += tile.cost
        } else if (["community_chest", "chance"].includes(tile.type)) {
            const deck = tile.type == "chance" ? this.chance : this.chests
            const card = deck.get()
            player.setService("card", card)
            if ("repairBuilding" == card.type) {
                mustPay += this.getRepairBuilding(player, card)
            }
            if ("money" == card.type && card.amount < 0) {
                mustPay += -card.amount
            }

        } else if (tile.id == "cops") this.arrest(username)
        else this.next()

        return mustPay
    }

    disablePlayer(username) {
        const player = this.players[username]
        for (let i = player.own.length - 1; i >= 0; i--) {
            player.removeOwn(this.field.getById(player.own[i]))
        }
        player.resetServices()
        player.disable = true
        this.checkWin()
    }

    checkWin() {
        const players = Object.values(this.players)
        const activePlayers = players.filter(p =>!p.disable)
        if (activePlayers.length == 1) {
            this.winner = activePlayers[0]
            this.stage = "end"
        }
    }

    arrest(username, next=true) {
        this.field.moveById(username, "jail")
        this.players[username].arrested = 3
        if (next) this.next()
    }

    next(options={}) {
        const { force } = options

        if (!force) {
            const [val1, val2] = this.dices
            const player = this.players[this.tracker.current]

            if (val1 == val2 && player.arrested == 0) return false
        }

        const nextUsername = this.tracker.next()
        if (this.players[nextUsername].disable) this.next({force: true})
        return true
    }

    pushLog(mes, sender="system", bold=null) {
        this.logs.push({sender, mes, bold}) 
    }

    pushError(mes, bold=null) {
        this.pushLog(mes, "error", bold)
    }
}

module.exports = Game
