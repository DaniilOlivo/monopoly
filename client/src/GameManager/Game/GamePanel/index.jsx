import { useState, useEffect } from "react"

import PlayerWidget from "./PlayerWidget"
import Roller from "./Roller"

import "./GamePanel.css"

function GamePanel(props) {
    const mapStatus = {
        firstRoll: "Roll the dice to determine the order of the players",
        waitPlayers: "Waiting for the other players",
        waitMove: "It's your move, "
    }

    const state = props.state
    const updateGame = props.updateGame

    const [currentStatus, setCurrentStatus] = useState("firstRoll")
    // At the stage of determining the order, each player has their own personal values of dice
    // In the main stage of the game, the value of a single player's throw is visible to everyone
    const [localRoller, setLocalRoller] = useState([1, 1])

    useEffect(() => {
        if (state.stage === "main") setCurrentStatus("waitMove")
        
    }, [state])

    function sendOrderPlayer(valueDice) {
        props.sendMes("set_order_player", {valueDice})
    }
    
    let roller = state.dices
    let clickRoll = (arrValue) => updateGame("dices", arrValue)
    if (state.stage === "start") {
        roller = localRoller
        clickRoll = (arrValues) => {
            setLocalRoller(arrValues)
            const valueDice = arrValues.reduce((sum, num) => sum + num, 0)
            sendOrderPlayer(valueDice)
            setCurrentStatus("waitPlayers")
        }
    }

    let playerWidget = < PlayerWidget {...state} />
    if (currentStatus === "firstRoll" ||  currentStatus === "waitPlayers") playerWidget = null

    let textStatus = mapStatus[currentStatus]
    if (currentStatus === "waitMove") textStatus += state.moves.current

    return (
        <div className="game-panel">
            <p className="status-line">{textStatus}</p>
            {playerWidget}
            < Roller values={roller} disable={currentStatus === "waitPlayers"} roll={clickRoll} />
        </div>
    )
}

export default GamePanel
