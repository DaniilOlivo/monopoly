const { settings } = require("./utils") 

const COLORS = settings["colors"]

const Tracker = require("./modules/tracker")
const Field = require("./modules/field")

class Game {
    constructor(usernames) {
        this.stage = "start"
        this.players = {}

        for (let i = 0; i < usernames.length; i++) {
            let username = usernames[i]
            this.players[username] = {
                color: COLORS[i],
                money: settings["startMoney"]
            }
        }

        const listPlayers = Object.keys(this.players)

        this.tracker = new Tracker(listPlayers.length)
        this.field = new Field(listPlayers)

        this.dices = [4, 2]
    }

    setOrderPlayer(username, value) {
        const result = this.tracker.setOrder(username, value)
        if (result) this.stage = "main"
    }

    rollDices(dices) {
        const currentPlayer = this.tracker.current
        this.dices = dices
        const [val1, val2] = dices 
        const [ok, circle] = this.field.move(currentPlayer, val1 + val2)
        if (ok) {
            if (circle) this.players[currentPlayer].money += 200
            if (val1 != val2) this.tracker.next()
        }
    }
}

module.exports = Game
