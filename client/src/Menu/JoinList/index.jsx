import { useState, useEffect } from "react"

import Window from "../../components/Window"
import { ListExtend } from "../../components/List"
import Button from "../../components/Button"

import "./JoinList.css"

function JoinList(props) {
    // props
    // go - func transition between pages menu
    // startGameModule - func(room)
    let [rooms, setRooms] = useState({})

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

    useEffect(() => {
        getRooms()
    }, [])

    return (
        <Window>
            <div className="join-list">
                < ListExtend title="Rooms" items={rooms} />
                <div className="join-list__panel-btns">
                    < Button title="Back" onClick={() => props.go("mainMenu")} />
                    < Button title="Update list" onClick={getRooms} />
                </div>
            </div>
        </Window>
    )
}

export default JoinList
