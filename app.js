const express = require("express")
const path = require("path")

require('dotenv').config()

const app = express()

const PORT = process.env.PORT
const HOST = "127.0.0.1"

const FOLDER_CLIENT = path.join(__dirname, "client")

app.use(express.static(path.join(FOLDER_CLIENT, "static")))

app.get("/", (req, res) => {
    let index = path.join(FOLDER_CLIENT, "index.html")
    res.sendFile(index)
})

app.listen(PORT, HOST, () => console.log(`Start server on http://127.0.0.1:${PORT}`))
