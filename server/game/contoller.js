const Executor = require("./executor")
const Validator = require("./validator")
const Console = require("./console")

class Controller {
    constructor(game) {
        this.core = game
        this.validator = new Validator(game)
        this.console = new Console(game, this.validator)

        // By default, the controller will catch errors and write them to the log.
        this.catchErrors = true
    }

    execute(username, action, options) {
        try {
            const executor = new Executor(username, this.core, this.validator)
            if (action == "command") {
                const { commandString } = options
                this.console.command(commandString)
            } else {
                this.validator.check(
                    action in executor,
                    "Invalid action",
                    action
                )
                executor[action](options)
            }
            this.core.lastAction = action
        } catch (error) {
            if (!this.catchErrors) throw error
            if (error.name == "ErrorGame") {
                const { message, detail } = error.objLog
                this.core.pushLog("error", message, "system", detail)
            } else this.core.pushLog("error", error.message)
        }
    }
}

module.exports = Controller
