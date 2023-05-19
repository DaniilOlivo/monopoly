const fs = require("fs")
const path = require("path")

const CONFIG_FOLDER = "config"

function getConfig(nameConfig) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, CONFIG_FOLDER, nameConfig)))
}

const settings = getConfig("settings_game.json")

module.exports = { settings,  getConfig}
