const { settings } = require("./utils")
const Core = require("./core")
const Validator = require("./validator")

class Executor {
    constructor(username, core=new Core(), validator=new Validator()) {
        this.username = username
        this.core = core
        this.validator = validator
    }

    _log(message, detail=null, username=null) {
        const sender = username ?? this.username
        this.core.pushLog("event", message, sender, detail)
    }

    _getPlayer(username=null) {
        return this.core.players[username ?? this.username]
    }

    _getTile(idTile) {
        this.validator.checkIdTile(idTile)
        return this.core.field.getById(idTile)
    }

    _passNewLap(boolNewLap) {
        if (!boolNewLap) return
        const lapMoney = settings["lapMoney"]
        this._log("passLap", lapMoney + 'M.')
        this._getPlayer().money += lapMoney
    }

    _dispathTile(tile) {
        const mustPay = this.core.dispathTile(tile, this.username)
        const capital = this.core.getCapital(this.username)

        if (capital < mustPay) {
            this._log("bankrupt")
            this.core.disablePlayer(this.username)
        }
    }

    _next(options) {
        if (options && options.next) this.core.next()
    }

    ping() {
        this._log("ping")
    }

    message({ message }) {
        this.core.pushLog("message", message, this.username)
    }

    roll({ dices }) {
        this._log("roll", dices.toString())
        
        if (this.core.stage == "start") {
            const result = this.core.tracker.setDiceValue(this.username, dices)
            if (result) this.core.stage = "main"
            return
        }

        this.validator.check(
            this.core.tracker.current == this.username,
            "It's not his turn now",
            this.username
        )
        this.core.dices = dices

        const [val1, val2] = dices
        const player = this._getPlayer()
        
        if (val1 == val2 && player.arrested > 0) {
            player.arrested = 0
            this._log("escapeDouble")
        }

        if (player.arrested > 0) {
            player.arrested -= 1
            this.core.next()
            this._log("stillPrison", player.arrested + " moves left")
            return
        }

        const newLapBool = this.core.field.move(this.username, val1 + val2)
        this._passNewLap(newLapBool)

        const tile = this.core.field.findPlayer(this.username)
        this._log("end", tile.title)

        this._dispathTile(tile)
    }

    buy(options={}) {
        const player = this._getPlayer()

        let tile = player.service.offer
        if (options.tile) tile = options.tile
        this.validator.check(tile, "Offer service is null")
        player.clearService("offer")

        if (options.refuse) {
            this._log("refuseBuy", tile.title)
            this._next(options)
            return
        }

        let price = tile.price
        if (options.free) price = 0

        this.validator.check(
            tile.canBuy,
            "This tile cannot be bought",
            tile.id
        )
        this.validator.checkMoney(price, player.money)
        this.validator.check(
            !tile.owner,
            "Already has an owner",
            tile.owner
        )

        player.money -= price
        player.addOwn(tile)
        this._log("buy", tile.title)
        this._next(options)
    }

    pledge(options={}) {
        const { type, idTile, free } = options

        const tile = this._getTile(idTile)

        this.validator.checkHasOwner(tile)
        const playerOwner = this._getPlayer(tile.owner)

        if (type === "put") {
            this.validator.check(
                !tile.pledge,
                "The property is already mortgaged",
                idTile
            )
            tile.pledge = true
            playerOwner.money += free ? 0 : tile.price / 2
            this._log("put", tile.title)
        }
        else if (type == "redeem") {
            const cost = free ? 0 : tile.price / 2
            this.validator.check(
                tile.pledge,
                "The property is not mortgaged",
                idTile
            )
            this.validator.checkMoney(cost, playerOwner.money)
            playerOwner.money -= cost
            tile.pledge = false
            this._log("redeem", tile.title)
        }
        else this.validator.throwError("Invalid type pledge", type)
    }

    build(options={}) {
        const { type, idTile, free } = options
        const tile = this._getTile(idTile)

        this.validator.checkHasOwner(tile)
        const playerOwner = this._getPlayer(tile.owner)

        this.validator.check(
            tile.color,
            "You can't build buildings",
            idTile
        )
        this.validator.check(
            playerOwner.monopoly[tile.color] == tile.numberTilesArea,
            "There is no monopoly on this area",
            idTile
        )

        if (type === "add") {
            const cost = free ? 0 : tile.priceBuilding
            this.validator.checkMoney(cost, playerOwner.money)
            playerOwner.money -= cost
            tile.addBuilding()
            this._log("build." + (tile.hotel ? "hotel" : "house"), tile.title)
        }
        else if (type == "remove") {
            playerOwner.money += free ? 0 : tile.priceBuilding / 2
            tile.removeBuilding()
            this._log("remove." + (tile.hotel ? "hotel" : "house"), tile.title)
        }
        else this.validator.throwError("Invalid type build", type)
    }

    rent(options={}) {
        const { free, tile } = options
        const player = this._getPlayer()

        let objRent = tile ? 
            {tile, cost: this.core.getRent(tile.id)} :
            player.service.rent
        this.validator.check(
            objRent,
            "The player does not owe rent to anyone",
            this.username
        )
        this.validator.checkHasOwner(objRent.tile)

        let price = free ? 0 : objRent.cost
        this.validator.checkMoney(price, player.money)

        const ownerPlayer = this._getPlayer(objRent.tile.owner)
        player.money -= price
        ownerPlayer.money += price
        player.clearService("rent")
        this._log("rent", price + "M.")
        this._next(options)
    }

    sell(options={}) {
        const { free, idTile } = options
        const tile = this._getTile(idTile)
        this.validator.checkHasOwner(tile)
        let money = tile.pledge ? tile.price / 2 : tile.price
        if (free) money = 0
        const playerOwner = this._getPlayer(tile.owner)
        playerOwner.money += money
        playerOwner.removeOwn(tile)
        if (tile.pledge) tile.pledge = false
    }

    tax(options={}) {
        const { value } = options

        const player = this._getPlayer()
        const cost = value ?? player.service.tax

        this.validator.check(cost, "The player has no tax", this.username)
        this.validator.checkMoney(cost, player.money)

        player.money -= cost
        player.clearService("tax")
        this._log("tax", cost + "M.")
        this._next(options)
    }

    deal(options={}) {
        const { objDeal } = options
        objDeal.initiator = this.username
        this.validator.checkObjDeal(objDeal)
        const player = this._getPlayer(objDeal.target)
        player.setService("deal", objDeal)
        this._log("deal", objDeal.target)
    }

    trade(options={}) {
        const { refuse } = options
        const targetPlayer = this._getPlayer()
        const objDeal = targetPlayer.service.deal
        targetPlayer.clearService("deal")
        if (refuse) return this._log("refuseDeal", objDeal.initiator)
        const initiatorPlayer = this._getPlayer(objDeal.initiator)
        this._log("madeDeal", objDeal.initiator)

        const swapMoney = (fromPlayer, toPlayer, value) => {
            this.validator.checkMoney(value, fromPlayer.money)
            fromPlayer.money -= value
            toPlayer.money += value
        }

        const swapTiles = (fromPlayer, toPlayer, arrTiles) => {
            for (const idTile of arrTiles) {
                const tile = this._getTile(idTile)
                fromPlayer.transfer(tile, toPlayer)
                this._log("swapProperty", tile.title, toPlayer.username)
            }
        }

        swapTiles(initiatorPlayer, targetPlayer, objDeal.income)
        swapTiles(targetPlayer, initiatorPlayer, objDeal.host)

        const { moneyHost, moneyIncome } = objDeal

        swapMoney(initiatorPlayer, targetPlayer, moneyIncome)
        swapMoney(targetPlayer, initiatorPlayer, moneyHost)

        if (objDeal.moneyHost > 0)
            this._log("swapMoney", moneyHost + " M.", objDeal.initiator)
        if (objDeal.moneyIncome > 0)
            this._log("swapMoney", moneyIncome + " M.", this.username)
    }

    card(options={}) {
        const player = this._getPlayer()
        const card = options.card ?? player.service.card
        this.validator.check(card, "The player has no card", this.username)
        player.clearService("card")

        const mapCards = {
            goTo: () => {
                const newBoolLap = this.core.field.moveById(this.username, card.location)
                this._passNewLap(newBoolLap)
                const newTile = this._getTile(card.location)
                this._log("goTo", newTile.title)
                this._dispathTile(newTile)
            },
            release: () => {
                player.releasePrison += 1
                this._log("release")
            },
            money: () => {
                player.money += card.amount
                this._log("money." + (card.amount >= 0 ? "receive" : "spend"), card.amount + " M.")
            },
            goToBack: () => {
                this.core.field.move(this.username, -card.amount)
                const newTile = this.core.field.findPlayer(this.username)
                this._log("goTo", newTile.title)
                this._dispathTile(newTile)
            },
            repairBuilding: () => {
                const cost = this.core.getRepairBuilding(player, card)
                player.money -= cost
                this._log("repairBuilding", cost + " M.")
            },
            arrest: () => {
                this.core.arrest(this.username)
                this._log("arrest")
            },
            happyBirthday: () => {
                const amount = card.amount
                const birthdayBoy = this._getPlayer()
                for (const player of Object.values(this.core.players)) {
                    const username = player.username
                    if (this.username == username) continue
                    
                    if (player.money < amount) {
                        this.core.disablePlayer(username)
                        break
                    }
                    player.money -= amount
                    birthdayBoy.money += amount
                }
                this._log("happyBirthday", amount + " M.")
            }
        }

        const type = card.type
        this.validator.check(type in mapCards, "Not found card type", type)
        mapCards[type]()
        if (!["goToBack", "goTo", "arrest"].includes(type)) this._next(options)
    }

    surrender() {
        this._log("surrender")
        this.core.disablePlayer(this.username)
    }

    jailbreak() {
        this._log("jailbreak")
        const player = this._getPlayer()
        this.validator.check(player.releasePrison > 0, "No releases from prison")
        player.releasePrison -= 1
        player.arrested = 0
    }

    disconnect() {
        this.core.disablePlayer(this.username)
        this._log("disconnect")
    }
}

module.exports = Executor
