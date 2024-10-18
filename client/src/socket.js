import { io } from "socket.io-client"
import store from "./store"
import router from "./router"

export const socket = io()

export function gameApi(command, options={}) {
    socket.emit("game", command, options)
}

export function leave(options={}) {
    socket.emit("leaveLobby", options)
    store.commit("setGame", null)
    store.commit("setUsername", "")
}

socket.on("responseCreateRoom", (res) => {
    if (res.status) router.push({
        name: "game",
        params: {room: res.title}
    })
    else store.commit("setService", {
        service: "create",
        value: res.desc
    })
})

socket.on("listRooms", (list) => {
    store.commit("setListRooms", list)
})

socket.on("responseEntryLobby", (res) => {
    if (res.status) {
        store.commit("setUsername", res.username)
    } else {
        store.commit("setService", {
            service: "register",
            value: res.desc
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
        if (objDeal) store.dispatch("deal/setDeal", {obj: objDeal, mode: "income"})
    }
})

socket.on("reconnect", (username) => {
    store.commit("setUsername", username)
})

socket.on("connect", () => store.commit("setConnection", true))
socket.on("disconnect", () => store.commit("setConnection", false))
