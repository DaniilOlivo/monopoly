import { reactive } from "vue"
import { io } from "socket.io-client"
import { store } from "./store"

export const state = reactive({
    connection: false,
    username: "",
    stage: "register",
    game: null,
    previousVerGame: null,
    messages: {
        "PlayerRegister": "",
        "WaitingList": null,
    }
})

export const socket = io({
    autoConnect: false,
})

export function gameApi(command, ...args) {
    socket.emit("game", command, ...args)
}

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
    const username = state.username
    state.previousVerGame = state.game
    store.setObjDeal(game.players[username].service.deal)
    state.game = game 
})

socket.on("connect", () => {
    state.connection = true
})

socket.on("disconnect", () => {
    state.connection = false
})

window.onunload = () => socket.disconnect()
