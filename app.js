const express = require("express")
const path = require("path")
const expressWs = require("express-ws")

const router = require("./server/router")
const handlerWs = require("./server/socket")

require('dotenv').config()

const PORT = process.env.PORT
const HOST = "127.0.0.1"

const app = express()
expressWs(app)

const FOLDER_CLIENT = path.join(__dirname, "client/build")

app.use(express.json())
app.use(express.static(path.resolve(FOLDER_CLIENT)))
app.use((req, res, next) => {
    res.on("finish", () => console.log(`HTTP | ${req.method} ${req.url} ${res.statusCode}`))
    next()
})
app.use("/api", router)
app.ws("/socket", handlerWs)

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, FOLDER_CLIENT, "index.html"))
})

app.listen(PORT, HOST, () => console.log(`Start server on http://127.0.0.1:${PORT}`))
