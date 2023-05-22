import { useState, useEffect } from "react"

import Window from "../../components/Window"
import { ListExtend } from "../../components/List"
import Button from "../../components/Button"

function JoinList(props) {
    let [rooms, setRooms] = useState({})

    useEffect(() => {
        async function getRooms() {
            const response = await fetch("/api/listRooms")
            const dataRooms = await response.json()
            console.log(dataRooms)
            const objRooms = {}
            for (const [title, data] of Object.entries(dataRooms)) {
                const { countPlayers } = data

                objRooms[title] = {
                    additionalTitle: `${countPlayers}/8`,
                    handler: () => props.startGameModule(title)
                }
            }
            setRooms(objRooms)
        }
        getRooms()
    }, [])

    return (
        <Window>
            <div className="join-list">
                < ListExtend title="Rooms" items={rooms} />
                < Button title="Back" onClick={() => props.go("mainMenu")} />
            </div>
        </Window>
    )
}

export default JoinList
