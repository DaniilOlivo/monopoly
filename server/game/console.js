const Core = require("./core")
const Validator = require("./validator")
const Executor = require("./executor")

class Console {
    constructor(core=new Core(), validator=new Validator()) {
        this.validator = validator
        this.core = core
    }

    _parseBool(valueString) {
        this.validator.check(
            ["true", "false"].includes(valueString),
            "invalid boolean flag",
            valueString
        )
        return valueString == "true"
    }

    _parseUsername(username) {
        const elementsUsername = username.split("_")
        let systemUsername = username
        if (elementsUsername.length > 1) systemUsername = elementsUsername.join(" ")
        this.validator.checkUsername(systemUsername)
        return systemUsername
    }

    _createExecutor(username) {
        const validUsername = this._parseUsername(username)
        return new Executor(validUsername, this.core, this.validator)
    }

    _createExecutorByTile(idTile) {
        const tile = this._getTile(idTile)
        this.validator.checkHasOwner(tile)
        return this._createExecutor(tile.owner)
    }

    _getTile(idTile) {
        this.validator.checkIdTile(idTile)
        return this.core.field.getById(idTile)
    }

    command(commandString) {
        const splitString = commandString.split(" ")
        const command = splitString[0]
        const args = splitString.slice(1)

        this.validator.check(command in this, "invalid command", command)
        this[command](args)
    }

    echo(args) {
        const [username, message] = args
        const exec = this._createExecutor(username)
        exec.message({ message })
    }

    buy(args) {
        const [username, idTile, free] = args

        const exec = this._createExecutor(username)
        const tile = this._getTile(idTile)
        exec.buy({tile, free: this._parseBool(free)})
    }

    buyAll(args) {
        const [username] = args
        
        const exec = this._createExecutor(username)
        for (const tile of this.core.field.tiles) {
            if (tile.owner || !tile.canBuy) continue
            exec.buy({tile, free: true})
        }

        const player = exec._getPlayer()

        for (const tile of this.core.field.tiles) {
            if (tile.color && tile.numberTilesArea == player.monopoly[tile.color]) {
                for (let i = 0; i <= 5; i++) {
                    exec.build({type: "add", idTile: tile.id, free: true})
                }
            }
        }
    }

    pledge(args) {
        const [type, idTile, free] = args
        const exec = this._createExecutorByTile(idTile)
        exec.pledge({type, idTile, free: this._parseBool(free)})
    }

    build(args) {
        const [type, idTile, free] = args
        const exec = this._createExecutorByTile(idTile)
        exec.build({type, idTile, free: this._parseBool(free)})
    }

    sell(args) {
        const [idTile, free] = args

        const exec = this._createExecutorByTile(idTile)
        exec.sell({idTile, free: this._parseBool(free)})
    }

    money(args) {
        const [username, value] = args

        const player = this.core.players[this._parseUsername(username)]
        let valueNumber = parseInt(value)
        this.validator.check(
            !Number.isNaN(valueNumber),
            "Value must be an integer",
            value
        )
        if (valueNumber < 0) this.validator.checkMoney(valueNumber, player.money)
        player.money += valueNumber
    }

    move(args) {
        const [username, idTile, dispath] = args

        const tile = this._getTile(idTile)

        const systemUsername = this._parseUsername(username)

        this.core.field.moveById(
            systemUsername,
            idTile
        )

        if (this._parseBool(dispath))
            this.core.dispathTile(tile, systemUsername)
    }

    arrest(args) {
        const [username] = args

        const systemUsername = this._parseUsername(username)
        let flagNext = false
        if (systemUsername == this.core.tracker.current) flagNext = true 
        this.core.arrest(systemUsername, flagNext)
    }

    add(args) {
        const [username, obj] = args

        if (obj == "jailbreak") {
            const exec = this._createExecutor(username)
            exec.card({card: {type: "release"}})
        } else this.validator.throwError("invalid object", obj)
    }

    monopoly(args) {
        const [username, color, free] = args
        const firstTile = this._getTile(color + "_1")
        for (let i = 1; i <= firstTile.numberTilesArea; i++) {
            this.buy([username, color + "_" + i, free])
        }
    }
}

module.exports = Console