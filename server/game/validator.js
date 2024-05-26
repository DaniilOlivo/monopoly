const Core = require("./core")

class ErrorGame extends Error {
    constructor(message, detail=null) {
        let textError = message
        if (detail) textError = message + ": " + detail
        
        super(textError)
        this.name = "ErrorGame"
        this.objLog = {message, detail}
    }
}

class Validator {
    constructor(core=new Core([])) {
        this.core = core
    }

    check(condition, message, detail=null) {
        if (!condition) throw new ErrorGame(message, detail)
    }

    checkHasOwner(tile) {
        this.check(tile.owner, "Property has no owner",  tile.id)
    }

    checkIdTile(idTile) {
        this.check(
            this.core.field.tiles.find(tile => tile.id == idTile),
            "No such id tile",
            idTile
        )
    }

    checkMoney(cost, money) {
        this.check(
            cost <= money,
            "The player does not have enough money",
            cost + " > " + money
        )
    }

    checkUsername(username) {
        this.check(
            this.core.players[username],
            "No such username",
            username
        )
    }

    checkObjDeal(obj) {
        const { initiator, target, income, host, moneyIncome, moneyHost } = obj

        this.checkUsername(initiator)
        this.checkUsername(target)

        this.check(
            (
                income &&
                host &&
                moneyIncome >= 0 &&
                moneyHost >= 0
            ),
            "Invalid object deal",
            JSON.stringify(obj)
        )
    }

    throwError(message, detail=null) {
        this.check(false, message, detail)
    }
}

module.exports = Validator