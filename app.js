const express = require("express")
const path = require("path")

const router = require("./server/router")

require('dotenv').config()

const app = express()

const PORT = process.env.PORT
const HOST = "127.0.0.1"

const FOLDER_CLIENT = path.join(__dirname, "client")
const parser = express.urlencoded({extended: true})

app.use(parser)
app.use(express.static(path.join(FOLDER_CLIENT, "static")))
app.use(router)

app.listen(PORT, HOST, () => console.log(`Start server on http://127.0.0.1:${PORT}`))
