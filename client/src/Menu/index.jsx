import { useState } from "react"

import MainMenu from "./MainMenu"
import CreateRoom from "./CreateRoom"
import JoinList from "./JoinList"

function Menu(props) {
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
