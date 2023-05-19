import { useEffect } from "react"

const exampleRoom = "Room"
const exampleUsername1 = "Daniil"
const exampleUsername2 = "Ivan"

export function useSkipCreateRoom(startGameModule) {
    useEffect(() => {
        async function createRoom() {
            const response = await fetch("/api/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({room: exampleRoom})
            })
    
            startGameModule("Room")
        }
        createRoom()
    }, [])
}

export function useSkipLoginRoom(setValue, register, mes) {
    useEffect(() => {
        if (mes && mes.event === "confirm_login" && !mes.options.confirm) {
            setValue(exampleUsername2)
            register()
        } else {
            setValue(exampleUsername1)
            register()
        }
    }, [mes, setValue, register])
}

export function useSkipStartGame(startGame) {
    useEffect(() => {
        startGame()
    }, [])
}
