import { reactive } from "vue"
import { io } from "socket.io-client"

export const state = reactive({
    connection: false
})

// const URL = "http://localhost:3000"

export const socket = io({
    autoConnect: false,
})

socket.on("connect", () => {
    state.connection = true
})

socket.on("disconnect", () => {
    state.connection = false
})
