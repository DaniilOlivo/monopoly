import { Window } from "../../../components/Window"
import List from "../../../components/List"
import Button from "../../../components/Button"

import { useSkipStartGame } from "../../../utils/skip"

function ListPlayers(props) {
    const lenPlayers = props.players.length

    let btnStartGame = <p>We are waiting for the host to start the game</p>
    if (props.host) {
        if (lenPlayers > 1) btnStartGame = < Button title="Start Game" onClick={props.startGame} />
        else btnStartGame = <p>To start the game you need at least 2 players</p>
    }

    // useSkipStartGame(props.startGame)

    return (
        <Window>
            < List title={`Players ${lenPlayers}/8`} items={props.players}/>
            {btnStartGame}
        </Window>
    )
}

export default ListPlayers
