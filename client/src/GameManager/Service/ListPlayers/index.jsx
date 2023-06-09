import Window from "../../../components/Window"
import { ListSimple } from "../../../components/List"
import Button from "../../../components/Button"

import { useSkipStartGame } from "../../../utils/skip"

function ListPlayers(props) {
    // props
    // players - list of str
    // startGame - func
    // host - bool
    const lenPlayers = props.players.length

    let btnStartGame = <p>We are waiting for the host to start the game</p>
    if (props.host) {
        if (lenPlayers > 1) btnStartGame = < Button title="Start Game" onClick={props.startGame} />
        else btnStartGame = <p>To start the game you need at least 2 players</p>
    }

    // useSkipStartGame(props.startGame)

    return (
        <Window>
            < ListSimple title={`Players ${lenPlayers}/8`} items={props.players}/>
            {btnStartGame}
        </Window>
    )
}

export default ListPlayers
