const express = require("express")
const path = require("path")

const roomManager = require("./rooms")


function getHtml(nameFile) {
    return path.join(__dirname, "..", "client", nameFile)
}

const router = express.Router()

router.get("/create/", (req, res) => {
    res.sendFile(getHtml("create.html"))
})

router.post("/create/", (req, res) => {
    const sendCreate = () => res.sendFile(getHtml("create.html"))
    if (!req.body || !req.body.room) sendCreate()
    else {
        let room = req.body.room
        let result = roomManager.createRoom(room)
        if (result) res.redirect(`/game/${room}`)
        else sendCreate()
    }
})

router.get("/join/", (req, res) => {
    res.sendFile(getHtml("join.html"))
})

router.get("/listRooms/", (req, res) => {
    res.send(JSON.stringify(roomManager.getTitlesRooms()))
})

router.get("/game/:room", (req, res) => {
    let room = req.params["room"]
    if (room in roomManager.rooms) res.sendFile(getHtml("game.html"))
    else res.redirect("/join/")
})

router.get("/", (req, res) => {
    res.sendFile(getHtml("index.html"))
})

module.exports = router
