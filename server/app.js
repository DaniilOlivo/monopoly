const express = require("express")
const morgan = require("morgan")

const apiRouter = require("./apiRouter")

const app = express()
app.use(express.json())
app.use(morgan("tiny"))
app.use("/api", apiRouter)

module.exports = app
