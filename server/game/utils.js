const fs = require("fs")
const path = require("path")

const CONFIG_FOLDER = "config"
const LANG_FOLDER = "locale"

function getConfig(nameConfig) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, CONFIG_FOLDER, nameConfig)))
}

const settings = getConfig("settings.json")

function getConfigLang(lang) {
    const pathCurrentLocale = path.join(__dirname, CONFIG_FOLDER, LANG_FOLDER, lang + ".json")
    if (fs.existsSync(pathCurrentLocale)) return JSON.parse(fs.readFileSync(pathCurrentLocale))
    else return JSON.parse(fs.readFileSync(path.join(__dirname, CONFIG_FOLDER, LANG_FOLDER, settings["defaultLang"] + ".json")))
}

module.exports = { settings,  getConfig, getConfigLang}
