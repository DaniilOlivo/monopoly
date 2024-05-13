const { settings } = require("./utils")

const Core = require("./index")

class ErrorControl extends Error {
    constructor(message, detail=null) {
        let textError = message
        if (detail) textError = message + ": " + detail

        super(textError)
        this.name = "ErrorControl"
        this.objLog = {message, detail}
    }
}

class Control {
    constructor(core=new Core([]), username) {
        this.core = core
        this.username = username

        // If test mode is running, logical errors in the game core will cause exceptions
        // Otherwise errors will be added to the log
        this.testMode = false
    }

    _log(message, detail=null) {
        this.core.pushLog(message, this.username, detail)
    }

    _validate(condition, message, detail=null) {
        if (condition) throw new ErrorControl(message, detail)
    }

    _validateHasOwner(tile) {
        this._validate(!tile.owner, "Property has no owner", tile.id)
    }

    _validateIdTile(idTile) {
        this._validate(
            !this.core.field.tiles.find(tile => tile.id == idTile),
            "No such id tile",
            idTile
        )
    }

    _validateMoney(cost, money) {
        this._validate(
            cost > money,
            "The player does not have enough money",
            cost + " > " + money
        )
    }

    _validateUsername(username) {
        this._validate(
           !this.core.players[username],
            "No such username",
            username
        )
    }

    _validateObjDeal(obj) {
        const { initiator, target, income, host, moneyIncome, moneyHost } = obj
        this._validate(
            (
                income &&
                host &&
                moneyIncome >= 0 &&
                moneyHost >= 0 &&
                this._validateUsername(initiator) &&
                this._validateUsername(target) 
            ),
            "Invalid object deal",
            JSON.stringify(obj)
        )
    }

    _getPlayer(username=null) {
        return this.core.players[username ?? this.username]
    }

    _getTile(idTile) {
        this._validateIdTile(idTile)
        return this.core.field.getById(idTile)
    }

    passNewLap(boolNewLap) {
        if (!boolNewLap) return
        const lapMoney = settings["lapMoney"]
        this._log("passes tile 'Go' and receives", lapMoney + 'M.')
        this._getPlayer().money += lapMoney
    }

    use(action, options) {
        try {
            this._validate(!(action in this), "Invalid action", action)
            this.core.lastAction = action
            this[action](options)
        } catch (error) {
            if (this.testMode) throw error
            const { mes, detail } = error.objLog
            this.core.pushError(mes, detail)
        }
    }

    ping() {
        this._log("ping")
    }

    message({ message }) {
        this._log(message)
    }

    roll({ dices }) {
        this._log("roll dices with meaning", dices.toString())
        
        if (this.core.stage == "start") {
            const result = this.core.tracker.setOrder(this.username, dices)
            if (result) this.core.stage = "main"
            return
        }

        this._validate(
            this.core.tracker.current !== this.username,
            "It's not his turn now",
            this.username
        )
        this.core.dices = dices

        const [val1, val2] = dices
        const player = this._getPlayer()
        
        if (val1 == val2 && player.arrested > 0) {
            player.arrested = 0
            this._log("throws a double and escapes from prison")
        }

        if (player.arrested > 0) {
            player.arrested -= 1
            this.core.next()
            this._log("are still in prison.", player.arrested + " moves left")
            return
        }

        const newLapBool = this.core.field.move(this.username, val1 + val2)
        this.passNewLap(newLapBool)

        const tile = this.core.field.findPlayer(this.username)
        this._log("ends up on the", tile.title)

        const mustPay = this.core.dispathTile(tile, this.username)
        const capital = this.core.getCapital(this.username)

        if (capital < mustPay) {
            this._log("becomes bankrupt and drops out of the game")
            this.core.disablePlayer(this.username)
            this.core.next()
        }
    }

    buy(options={}) {
        const player = this._getPlayer()

        let tile = player.service.offer
        if (options.tile) tile = options.tile
        this._validate(!tile, "Offer service is null")
        player.clearService("offer")

        if (options.refuse) return this._log("refused buy", tile.title)

        let price = tile.price
        if (options.free) price = 0

        this._validate(!tile.canBuy, "This tile cannot be bought", tile.id)
        this._validateMoney(price, player.money)
        this._validate(tile.owner, "Already has an owner", tile.owner)

        player.money -= price
        player.addOwn(tile)
        this._log("buys", tile.title)
    }

    pledge(options={}) {
        const { type, idTile, free } = options

        const tile = this._getTile(idTile)

        this._validateHasOwner(tile)
        const playerOwner = this._getPlayer(tile.owner)

        if (type === "put") {
            this._validate(tile.pledge, "The property is already mortgaged", idTile)
            tile.pledge = true
            playerOwner.money += free ? 0 : tile.price / 2
            this._log("put pledges", tile.title)
        }
        else if (type == "redeem") {
            const cost = free ? 0 : tile.price / 2
            this._validate(!tile.pledge, "The property is not mortgaged", idTile)
            this._validateMoney(cost, playerOwner.money)
            playerOwner.money -= cost
            tile.pledge = false
            this._log("redeem pledge", tile.title)
        }
        else throw new ErrorControl("Invalid type pledge", type)
    }

    build(options={}) {
        const { type, idTile, free } = options
        const tile = this._getTile(idTile)

        this._validateHasOwner(tile)
        const playerOwner = this._getPlayer(tile.owner)

        this._validate(
            !tile.color,
            "You can't build buildings",
            idTile
        )
        this._validate(
            playerOwner.monopoly[tile.color] != tile.numberTilesArea,
            "There is no monopoly on this area",
            idTile
        )

        if (type === "add") {
            const cost = free ? 0 : tile.priceBuilding
            this._validateMoney(cost, playerOwner.money)
            playerOwner.money -= cost
            tile.addBuilding()
            this._log(`built ${tile.hotel ? "hotel" : "building"}`, tile.title)
        }
        else if (type == "remove") {
            playerOwner.money += free ? 0 : tile.priceBuilding / 2
            tile.removeBuilding()
            this._log(`removed ${tile.hotel ? "hotel" : "building"}`, tile.title)
        }
        else throw new ErrorControl("Invalid type build")
    }

    rent(options={}) {
        const { free, tile } = options
        const player = this._getPlayer()

        let objRent = tile ? 
            {tile, cost: this.core.getRent(tile.id)} :
            player.service.rent
        this._validate(
            !objRent,
            "The player does not owe rent to anyone",
            this.username
        )
        this._validateHasOwner(objRent.tile)

        let price = free ? 0 : objRent.cost
        this._validateMoney(price, player.money)

        const ownerPlayer = this._getPlayer(objRent.tile.owner)
        player.money -= price
        ownerPlayer.money += price
        player.clearService("rent")
        this._log("paid rent", price + "M.")
    }

    sell(options={}) {
        const { free, idTile } = options
        const tile = this._getTile(idTile)
        this._validateHasOwner(tile)
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

        this._validate(!cost, "The player has no tax", this.username)
        this._validateMoney(cost, player.money)

        player.money -= cost
        player.clearService("tax")
        this._log("paid tax", cost + "M.")
    }

    deal(options={}) {
        const { objDeal } = options
        objDeal.initiator = this.username
        this._validateObjDeal(objDeal)
        const player = this._getPlayer(objDeal.target)
        player.setService("deal", objDeal)
        this._log("proposed a deal", objDeal.target)
    }

    trade(options={}) {
        const { refuse } = options
        const targetPlayer = this._getPlayer()
        const objDeal = targetPlayer.service.deal
        targetPlayer.clearService("deal")
        if (refuse) return this._log("refused the deal with the player", objDeal.initiator)
        const initiatorPlayer = this._getPlayer(objDeal.initiator)
        this._log("made a deal with the player", objDeal.initiator)

        const swapMoney = (fromPlayer, toPlayer, value) => {
            this._validateMoney(value, fromPlayer.money)
            fromPlayer.money -= value
            toPlayer.money += value
        }

        const swapTiles = (fromPlayer, toPlayer, arrTiles) => {
            for (const idTile of arrTiles) {
                const tile = this._getTile(idTile)
                fromPlayer.transfer(tile, toPlayer)
                this.core.pushLog("receives property", toPlayer.username, tile.title)
            }
        }

        swapTiles(initiatorPlayer, targetPlayer, objDeal.income)
        swapTiles(targetPlayer, initiatorPlayer, objDeal.host)

        const { moneyHost, moneyIncome } = objDeal

        swapMoney(initiatorPlayer, targetPlayer, moneyIncome)
        swapMoney(targetPlayer, initiatorPlayer, moneyHost)

        if (objDeal.moneyHost > 0)
            this.core.pushLog("receives money", objDeal.initiator, moneyHost + " M.")
        if (objDeal.moneyIncome > 0)
            this.core.pushLog("receives money", objDeal.host, moneyIncome + " M.")
    }

    card(options={}) {
        const player = this._getPlayer()
        const card = options.card ?? player.service.card
        this._validate(!card, "The player has no card", this.username)
        player.clearService("card")

        const mapCards = {
            goTo: () => {
                const newBoolLap = this.core.field.moveById(this.username, card.location)
                this.passNewLap(newBoolLap)
                const newTile = this.core.field.getById(card.location)
                this.core.dispathTile(newTile, this.username)
                this._log("goes on tile", newTile.title)
            },
            release: () => {
                player.releasePrison += 1
                this._log("arrested!")
            },
            money: () => {
                player.money += card.amount
                this._log(
                    `${card.amount >= 0 ? "receives" : "spends"} money`,
                    card.amount + " M."
                )
            },
            goToBack: () => {
                this.core.field.move(this.username, -card.amount)
                const newTile = this.core.field.findPlayer(this.username)
                this.core.dispathTile(newTile, this.username)
                this._log("goes on tile", newTile.title)
            },
            repairBuilding: () => {
                const cost = this.core.getRepairBuilding(player, card)
                player.money -= cost
                this._log("pays for his buildings", cost + " M.")
            },
            arrest: () => {
                this.core.arrest(this.username)
                this._log("arrested!")
            },
            happyBirthday: () => {
                const amount = card.amount
                const birthdayBoy = this._getPlayer()
                for (const player of Object.values(this.core.players)) {
                    const username = player.username
                    if (this.username == username) continue
                    
                    if (player.money < amount) this.core.disablePlayer(username)
                    else {
                        player.money -= amount
                        birthdayBoy.money += amount
                    }
                }
                this._log("player's birthday! Everyone chips in", amount + " M.")
            }
        }

        const type = card.type
        this._validate(!(type in mapCards), "Not found card type", type)
        mapCards[type]()
    }
}

module.exports = Control
