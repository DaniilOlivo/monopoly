import { useState, useEffect } from "react"
import useWebSocket from "react-use-websocket"

import ErrorWindow from "../components/ErrorWindow"
import LoginWindow from "./Service/LoginWindow"
import ListPlayers from "./Service/ListPlayers"
import Game from "./Game"

function GameManager(props) {
    // props
    // room - title room, str
    const wsUrl = `ws://${document.location.host}/socket`

    const room = props.room

    const [windowError, setWindowError] = useState(null)

    const { sendJsonMessage, lastJsonMessage } = useWebSocket(wsUrl, {
        onError: (error) => setWindowError(< ErrorWindow error={error} />)
    })

    useEffect(() => console.log(lastJsonMessage), [lastJsonMessage])

    function sendMes(event, options) {
        sendJsonMessage({event, options})
    }

    const [username, setUsername] = useState("")
    const [host, setHost] = useState("")
    const [players, setPlayers] = useState([])
    const [boolStartGame, setBoolStartGame] = useState(false)

    function startGame() {
        sendMes("start_game", {roomTilte: room})
    }

    useEffect(() => {
        const mes = lastJsonMessage
        if (!mes) return
        const {event, options} = mes
        if (event === "data_room") {
            setHost(options.host)
            setPlayers(options.players)
        }
        if (event === "game_init") setBoolStartGame(true)
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
    if (players.length > 0 && host && !boolStartGame) {
        windows.push(< ListPlayers
            host={host === username}
            players={players}
            startGame={startGame} />)
    }

    let game = null
    if (boolStartGame) {
        game = < Game sendMes={sendMes} mes={lastJsonMessage} />
    }

    return (
        <div className="game-manager">
            {game}
            <div className="windows">
                {windows}
            </div>
            <div className="error">
                {windowError}
            </div>
        </div>
    )
}

export default GameManager
