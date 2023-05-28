import { useState } from "react"

import Window from "../../components/Window";
import Form from "../../components/Form";


function CreateRoom(props) {
    // props
    // go - func transition between pages menu
    // startGameModule - func(room)
    const [value, setValue] = useState("")
    const [error, setError] = useState("")

    const btnsMap = {
        "Back": () => props.go("mainMenu"),
        "Create": async () => {
            const response = await fetch("/api/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({room: value})
            })
            const { accept, info } = await response.json()
            if (accept) {
                props.startGameModule(value)
            } else if (info) setError(info)
        }
    }

    return (
        <Window>
            < Form 
                parameter="Room"
                btns={btnsMap}
                value={value}
                onChange={setValue}
                error={error}
                />
        </Window>
    )
}

export default CreateRoom
