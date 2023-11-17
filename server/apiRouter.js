const express = require("express")

const { roomManager } = require("./rooms")

const router = express.Router()

router.post("/create", (req, res) => {
    const title = req.body.title
    const result = roomManager.createRoom(title)
    let responseData = {ok: false, desc: "There is already a room with that name"}
    if (result) {
        responseData = {ok: true, desc: "Room created"}
    }
    res.send(JSON.stringify(responseData))
})

router.get("/list", (req, res) => {
    const listRooms = roomManager.getTitles()
    res.send(JSON.stringify(listRooms))
})

module.exports = router
