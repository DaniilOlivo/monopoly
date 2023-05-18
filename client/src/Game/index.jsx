import { useState, useEffect } from "react"
import useWebSocket from "react-use-websocket"

import ErrorWindow from "../components/ErrorWindow"
import LoginWindow from "./Service/LoginWindow"
import ListPlayers from "./Service/ListPlayers"

function Game(props) {
    const wsUrl = `ws://${document.location.host}/ws`

    const room = props.room

    const [windowError, setWindowError] = useState(null)

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(wsUrl, {
        onError: (error) => setWindowError(< ErrorWindow error={error} />)
    })

    function sendMes(event, options) {
        sendJsonMessage({event, options})
    }

    const [username, setUsername] = useState("")
    const [host, setHost] = useState("")
    const [players, setPlayers] = useState([])
    const [startGame, setStartGame] = useState(false)

    useEffect(() => {
        const mes = lastJsonMessage
        if (!mes) return
        const {event, options} = mes
        if (event === "data_room") {
            setHost(options.host)
            setPlayers(options.players)
        }
    }, [lastJsonMessage])

    const windows = []
    if (!username) {
        windows.push(< LoginWindow
            room={room} 
            goBack={props.goBack}
            sendMes={sendMes}
            mes={lastJsonMessage}
            login={setUsername} />)
    }
    if (players.length > 0 && host && !startGame) {
        windows.push(< ListPlayers
            host={host === username}
            players={players}
            startGame={() => console.log("Start Gamee")} />)
    }

    return (
        <div className="game">
            <div className="windows">
                {windows}
            </div>
            <div className="error">
                {windowError}
            </div>
        </div>
    )
}

export default Game
