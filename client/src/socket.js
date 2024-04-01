import { io } from "socket.io-client"
import store from "./store"

export const socket = io({
    autoConnect: false,
})

export function gameApi(command, ...args) {
    socket.emit("game", command, ...args)
}

socket.on("registerResponse", (username, status, desc) => {
    if (status) {
        store.commit("setUsername", username)
        store.commit("nextStage")
    } else {
        store.commit("setService", {
            service: "register",
            value: desc
        })
    }
})

socket.on("dataRoom", (players) => {
    store.commit("setService", {
        service: "waiting",
        value: players
    })
})

socket.on("initGame", () => {
    store.commit("nextStage")
})

socket.on("updateGame", (game) => {
    store.commit("setGame", game)
})

socket.on("connect", () => store.commit("setConnection", true))
socket.on("disconnect", () => store.commit("setConnection", false))

window.onunload = () => socket.disconnect()
