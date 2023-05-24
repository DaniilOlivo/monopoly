import { useEffect, useState } from "react"

import Field from "./Field"
import GamePanel from "./GamePanel"

import "./Game.css"

function Game(props) {
    const [stateGame, setStateGame] = useState({
        tiles: [],
        players: {},
        moves: {},
        roller: [1, 1],
        stage: {}
    })

    function updateGame(titleModuleGame, stateModuleGame) {
        let newState = {}
        Object.assign(newState, stateGame)
        newState[titleModuleGame] = stateModuleGame
        props.sendMes("set_new_state_game", {state: newState})   
    }

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
            < GamePanel state={stateGame} sendMes={props.sendMes} updateGame={updateGame} />
        </div>
    )
}

export default Game
