const http = require("http")
const express = require("express")
const { WebSocketServer } = require("ws")
const path = require("path")

const router = require("./server/router")
const createSocketHandler = require("./server/socket")

require('dotenv').config()

const PORT = process.env.PORT
const HOST = "127.0.0.1"

const app = express()
const server = http.createServer(app)
const wsServer = new WebSocketServer({ server })

const FOLDER_CLIENT = path.join(__dirname, "client")
const parser = express.urlencoded({extended: true})

app.use(parser)
app.use(express.static(path.join(FOLDER_CLIENT, "static")))
app.use(router)
wsServer.on("connection", createSocketHandler(wsServer))

server.listen(PORT, HOST, () => console.log(`Start server on http://127.0.0.1:${PORT}`))
