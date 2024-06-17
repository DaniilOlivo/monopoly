const express = require("express")

const { roomManager, LIMIT_ROOM } = require("./rooms")

const router = express.Router()

router.post("/create", (req, res) => {
    const title = req.body.title
    const result = roomManager.createRoom(title)
    let responseData = {ok: false, desc: "There is already a room with that name"}
    if (result) responseData = {ok: true, desc: "Room created"}
    res.send(JSON.stringify(responseData))
})

router.get("/list", (req, res) => {
    const list = roomManager.getDataRooms()
    const filterList = list.filter(room => room.count < LIMIT_ROOM && room.status == "lobby")
    res.send(JSON.stringify(filterList))
})

router.post("/delete", (req, res) => {
    const title = req.body.title
    const result = roomManager.deleteRoom(title)
    let responseData = {ok: false, desc: "There is no such room"}
    if (result) responseData = {ok: true, desc: "Room deleted"}
    res.send(JSON.stringify(responseData))
})

module.exports = router
