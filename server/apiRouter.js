const express = require("express")

const router = express.Router()

router.post("/create", (req, res) => {
    const title = req.body.title
    res.send(JSON.stringify({ok: true, desc: "Room created"}))
})

router.get("/list", (req, res) => {
    res.send(JSON.stringify(["Room 1", "Room 2"]))
})

module.exports = router
