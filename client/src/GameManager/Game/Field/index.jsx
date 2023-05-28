import { Tile } from "./Tile"

import "./Field.css"

function Field(props) {
    // props
    // players and tiles - modules core game
    const specailTiles = {
        start: "Go",
        jail: "Jail",
        parking: "Free Parking",
        cops: "Go to Jail"
    }

    const tiles = []
    const pushTile = (options) => tiles.push(< Tile {...options} />)
    const getPlayers = (tile) => {
        let listColors = []
        for (const username of tile.players) {
            listColors.push(props.players[username].color)
        }
        return listColors
    }

    for (const tile of props.tiles) {
        if (tile.id in specailTiles) {
            const id = tile.id
            const title = specailTiles[id]
            specailTiles[id] = < Tile title={title} size="square" className={id} players={getPlayers(tile)} />
        }
        else {
            let options = {}
            Object.assign(options, tile)
            options.players = getPlayers(tile)
            if (tile.type === "community_chest") options = {title: "Community chest"}
            if (tile.type === "chance") options = {title: "Chance"}
            if (tile.type === "tax") options.price = tile.cost
            pushTile(options)
        }
    }

    const lines = {
        bottom: tiles.slice(0, 9),
        left: tiles.slice(9, 18),
        top: tiles.slice(18, 27),
        right: tiles.slice(27, 36)
    }

    const content = []
    for (const tile of Object.values(specailTiles)) content.push(tile)
    for (const [className, line] of Object.entries(lines)) {
        content.push(<div className={"line line_" + className} key={className}>{line}</div>)
    }

    content.push(<div className="logo"><h1 className="logo__title">MONOPOLY</h1></div>)

    return (
        <div className="field">
            {content}
        </div>
    )
}

export default Field
