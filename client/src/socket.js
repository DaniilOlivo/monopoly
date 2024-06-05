import { io } from "socket.io-client"
import store from "./store"

export const socket = io({
    autoConnect: false,
})

export function gameApi(command, options={}) {
    socket.emit("game", command, options)
}

socket.on("registerResponse", (username, status, desc) => {
    if (status) {
        store.commit("setUsername", username)
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

socket.on("updateGame", (game) => {
    store.commit("setGame", game)
    if (store.getters.stage == "game") {
        const objDeal = store.getters.thisPlayer.service.deal
        if (objDeal) store.commit("deal/setDeal", objDeal)
    }
})

socket.on("reconnect", (username) => {
    store.commit("setUsername", username)
})

socket.on("connect", () => store.commit("setConnection", true))
socket.on("disconnect", () => store.commit("setConnection", false))

window.onunload = () => socket.disconnect()
