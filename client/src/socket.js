import { reactive } from "vue"
import { io } from "socket.io-client"

export const state = reactive({
    connection: false,
    username: "",
    stage: "register",
    game: null,
    messages: {
        "PlayerRegister": "",
        "WaitingList": null,
    }
})

// const URL = "http://localhost:3000"

export const socket = io({
    autoConnect: false,
})

socket.on("registerResponse", (username, status, desc) => {
    if (status) {
        state.username = username
        state.stage = "waiting"
    }
    
    state.messages.PlayerRegister = desc
})

socket.on("dataRoom", (players) => {
    console.log(players)
    state.messages.WaitingList = players
})

socket.on("initGame", () => {
    state.stage = "main"
})

socket.on("updateGame", (game) => {
    state.game = game 
})

socket.on("connect", () => {
    state.connection = true
})

socket.on("disconnect", () => {
    state.connection = false
})

window.onunload = () => socket.disconnect()
