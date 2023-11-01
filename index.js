const dotenv = require("dotenv")
const http = require("http")
const { Server } = require("socket.io")

const app = require("./server/app")
const connectSocket = require("./server/socket")

dotenv.config()

const server = http.createServer(app)
const io = new Server(server)

io.on("connection", connectSocket)

const PORT = process.env.PORT ?? 5500
server.listen(PORT, () => console.log("Server start http://127.0.0.1:" + PORT))
