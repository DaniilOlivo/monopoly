const Executor = require("./executor")
const Validator = require("./validator")

class Controller {
    constructor(game) {
        this.core = game
        this.validator = new Validator(game)

        // By default, the dispatcher will catch errors and write them to the log.
        this.catchErrors = true
    }

    execute(username, action, options) {
        try {
            const executor = new Executor(username, this.core, this.validator)
            this.validator.check(
                action in executor,
                "Invalid action",
                action
            )
            this.core.lastAction = action
            executor[action](options)
        } catch (error) {
            if (!this.catchErrors) throw error
            if (error.name == "ErrorGame") {
                const { message, detail } = error.objLog
                this.core.pushError(message, detail)
            } else this.core.pushError(error.message)
        }
    }
}

module.exports = Controller
