import { useState, useEffect } from "react"

import PlayerWidget from "./PlayerWidget"
import Roller from "./Roller"

import "./GamePanel.css"

const mapStatus = {
    firstRoll: "Roll the dice to determine the order of the players",
    waitPlayers: "Waiting for the other players",
    waitMove: "It's your move, "
}

// At the stage of determining the order, each player has their own personal values of dice
// In the main stage of the game, the value of a single player's throw is visible to everyone
// Accordingly, there is a local roller, and a server, general, state
function useRoller(state, sendFunc, localFunc) {
    const [localRoller, setLocalRoller] = useState([1, 1])

    let dices = state.dices
    let clickRoll = sendFunc
    if (state.stage === "start") {
        dices = localRoller
        clickRoll = (arrValues) => {
            setLocalRoller(arrValues)
            const totalValueDices = arrValues.reduce((sum, num) => sum + num, 0)
            setTimeout(() => localFunc(totalValueDices), 2000)       
        }
    }

    return [dices, clickRoll]
}

function GamePanel(props) {
    // props
    // state - global state game, obj
    // sendMes - func(event: str, options: obj)
    // thisPlayer - str
    const state = props.state

    const [currentStatus, setCurrentStatus] = useState("firstRoll")
    

    useEffect(() => {
        if (state.stage === "main") setCurrentStatus("waitMove")   
    }, [state])

    const sendMes = props.sendMes
    const sendRollDices = (dices) => sendMes("roll_dices", {dices})
    const sendOrderPlayer = (valueDice) => sendMes("set_order_player", {valueDice})
    
    const [dices, clickRoll] = useRoller(state, sendRollDices, (totalValue) => {
        sendOrderPlayer(totalValue)
        setCurrentStatus("waitPlayers")
    })


    let playerWidget = null
    if (state.stage === "main") playerWidget = < PlayerWidget {...state} />

    let textStatus = mapStatus[currentStatus]
    if (currentStatus === "waitMove") textStatus += state.tracker.current

    let boolDisableRoller = true
    if (currentStatus === "firstRoll") boolDisableRoller = false
    else if (currentStatus === "waitMove" && state.tracker.current === props.thisPlayer) boolDisableRoller = false 

    return (
        <div className="game-panel">
            <p className="status-bar">{textStatus}</p>
            {playerWidget}
            < Roller values={dices} disable={boolDisableRoller} roll={clickRoll} />
        </div>
    )
}

export default GamePanel
