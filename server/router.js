const express = require("express")
const path = require("path")

const listRooms = []

function getHtml(nameFile) {
    return path.join(__dirname, "..", "client", nameFile)
}

const router = express.Router()

router.get("/create/", (req, res) => {
    res.sendFile(getHtml("create.html"))
})

router.post("/create/", (req, res) => {
    if (!req.body || !req.body.login) res.sendFile(getHtml("create.html"))
    else {
        let login = req.body.login
        listRooms.push(login)
        res.redirect(`/game/${login}`)
    }
})

router.get("/join/", (req, res) => {
    res.sendFile(getHtml("join.html"))
})

router.get("/listRooms/", (req, res) => {
    res.send(JSON.stringify(listRooms))
})

router.get("/game/:room", (req, res) => {
    let room = req.params["room"]
    res.sendFile(getHtml("game.html"))
})

router.get("/", (req, res) => {
    res.sendFile(getHtml("index.html"))
})

module.exports = router
