import Button from "../../components/Button"
import { Window } from "../../components/Window"

import "./MainMenu.css"

function MainMenu(props) {
    return (
        <Window>
            <nav className="main-menu">
                < Button title="Create" onClick={() => props.go("create")} />
                < Button title="Join" onClick={() => props.go("join")} />
            </nav>
        </Window>
    )
}

export default MainMenu
