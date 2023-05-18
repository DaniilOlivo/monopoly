const express = require("express")

const roomManager = require("./rooms")

const router = express.Router()


router.post("/create", (req, res) => {
    if (!req.body || !req.body.room) res.json({accept: false})
    else {
        let room = req.body.room
        let result = roomManager.createRoom(room)
        if (result) res.json({accept: true})
        else res.json({accept: false, info: "Such a room already exists"})
    }
})

router.get("/listRooms", (req, res) => {
    res.send(JSON.stringify(roomManager.getTitlesRooms()))
})

module.exports = router
