import { useEffect, useState } from "react"

import Field from "./Field"
import GamePanel from "./GamePanel"

import "./Game.css"

function Game(props) {
    // props
    // sendMes - func(event: str, options: obj)
    // mes - last message, obj
    const [stateGame, setStateGame] = useState({
        tiles: [],
        players: {},
        moves: {},
        dices: [1, 1],
        stage: ""
    })

    useEffect(() => {
        const mes = props.mes
        if (!mes) return
        const {event, options} = mes
        if (event === "game_update") {
            setStateGame(options.game)
        }
    }, [props.mes])

    return (
        <div className="game">
            < Field tiles={stateGame.tiles} players={stateGame.players} />
            < GamePanel state={stateGame} sendMes={props.sendMes} />
        </div>
    )
}

export default Game
