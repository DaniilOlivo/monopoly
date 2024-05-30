const express = require("express")

const { roomManager } = require("./rooms")

const router = express.Router()

router.post("/create", (req, res) => {
    const title = req.body.title
    const result = roomManager.createRoom(title)
    let responseData = {ok: false, desc: "Комната с таким названием уже существует"}
    if (result) responseData = {ok: true, desc: "Комната создана"}
    res.send(JSON.stringify(responseData))
})

router.get("/list", (req, res) => {
    const listRooms = roomManager.getTitles()
    res.send(JSON.stringify(listRooms))
})

router.post("/delete", (req, res) => {
    const title = req.body.title
    const result = roomManager.deleteRoom(title)
    let responseData = {ok: false, desc: "Комната не найдена"}
    if (result) responseData = {ok: true, desc: "Комната удалена"}
    res.send(JSON.stringify(responseData))
})

module.exports = router
