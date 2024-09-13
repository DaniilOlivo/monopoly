const dotenv = require("dotenv")
const http = require("http")
const express = require("express")
const path = require("path")
const { Server } = require("socket.io")

const staticFolderPath = path.join(__dirname, "client", "dist")

const app = require("./server/app")
const WrapSocket = require("./server/socket")

app.use(express.static(staticFolderPath))
app.get("*", (req, res) => {
    res.sendFile(path.join(staticFolderPath, "index.html"))
})

dotenv.config()

const server = http.createServer(app)
const io = new Server(server)

io.on("connection", (socket) => new WrapSocket(socket, io))

const PORT = process.env.PORT ?? 5500
server.listen(PORT, () => console.log("Server start http://127.0.0.1:" + PORT))

module.exports = server
