import "./PlayerWidget.css"

function PlayerCard(props) {
    // props
    // select - bool
    // color - str
    // username - str
    // money - int

    let className = "player-card"
    if (props.select) className += " player-card_select"
    return (
        <div className={className}>
            <div className="player-card__marker" style={{backgroundColor: props.color}}></div>
            <p className="player-card__username">{props.username}</p>
            <p className="player-card__money">{props.money} M</p>
        </div>
    )
}

function PlayerWidget(props) {
    // props
    // moves and players - modules core game

    const {moves, players} = props

    const listCards = []
    for (const username of moves.order) {
        let select = false
        if (moves.currentMove === username) select= true 
        listCards.push(< PlayerCard username={username} {...players[username]} select={select} />)
    }

    return (
        <div className="player-widget">
            <div className="list-players">
                {listCards}
            </div>

            <p className="player-widget__current-move"></p>
        </div>
    )
}

export default PlayerWidget
