import { useEffect, useState } from "react"

import Field from "./Field"

function Game(props) {
    const [stateField, setStateField] = useState([])

    useEffect(() => {
        const mes = props.mes
        if (!mes) return
        const {event, options} = mes
        if (event === "game_update") {
            setStateField(options.game.tiles)
        }
    }, [props.mes])

    return (
        <div className="game">
            < Field tiles={stateField} />
        </div>
    )
}

export default Game
