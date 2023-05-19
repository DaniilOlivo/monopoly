import { useState, useEffect } from "react"

import Window from "../../components/Window"
import List from "../../components/List"
import Button from "../../components/Button"

function JoinList(props) {
    let [rooms, setRooms] = useState({})

    useEffect(() => {
        async function getRooms() {
            const response = await fetch("/api/listRooms")
            const listRooms = await response.json()
            const objRooms = {}
            for (const room of listRooms) {
                objRooms[room] = () => props.startGameModule(room)
            }
            setRooms(objRooms)
        }
        getRooms()
    }, [])

    return (
        <Window>
            <div className="join-list">
                < List title="Rooms" items={rooms} clickable={true}/>
                < Button title="Back" onClick={() => props.go("mainMenu")} />
            </div>
        </Window>
    )
}

export default JoinList
