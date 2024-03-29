import { createRoom } from "@/api/menu"
import { socket } from "@/socket"

const titleRoom = "Hell"

const player1 = "Scorpion"
const player2 = "Sub Zero"

const skipOn = true

export async function skipCreate(router) {
    if (!skipOn) return
    const {ok, desc} = await createRoom(titleRoom)
    if (ok) {
        router.push({
            name: "game",
            params: {room: titleRoom}
        })
    } else {
        if (desc == "There is already a room with that name") {
            router.push({
                name: "game",
                params: {room: titleRoom}
            })
        }
    }
}

export function skipRegister(player=player1) {
    if (!skipOn) return
    socket.emit("register", player, titleRoom)
    socket.once("registerResponse", (username, status, desc) => {
        if (!status && username == player1 && desc == "Such a player already exists") {
            skipRegister(player2)
        } 
    })
}

export function skipStartGame(listPlayers) {
    if (!skipOn) return
    if (listPlayers.length >= 2) {
        socket.emit("startGame")
    }
}
