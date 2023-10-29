const dotenv = require("dotenv")
const http = require("http")

const app = require("./server/app")

dotenv.config()

const server = http.createServer(app)

const PORT = process.env.PORT ?? 5500
server.listen(PORT, () => console.log("Server start http://127.0.0.1:" + PORT))
