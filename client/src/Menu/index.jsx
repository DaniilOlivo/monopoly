import { useState } from "react"

import MainMenu from "./MainMenu"
import CreateRoom from "./CreateRoom"
import JoinList from "./JoinList"

import "./Menu.css"

function Menu(props) {
    // props
    // startGameModule - func(room)
    const [id, setId] = useState("mainMenu")

    const mapMenu = {
        mainMenu: < MainMenu go={setId} />,
        create: < CreateRoom go={setId} startGameModule={props.startGameModule} />,
        join: < JoinList go={setId} startGameModule={props.startGameModule} />
    }

    const page = mapMenu[id]

    return (
        <div className="menu">
            {page}
        </div>
    )
}

export default Menu
