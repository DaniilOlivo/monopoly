import "./Tile.css"

export function Tile(props) {
    // props
    // size - "square" or "rectangle" (default)
    // className - str
    // color - str
    // title - str
    // price - int
    // players - list of str colors
    const classList = ["tile", "tile_rectangle"]
    if (props.size === "square") classList.push("tile_square")
    if (props.className) classList.push(props.className)
    
    const content = []
    if (props.color) {
        const styleObj = {
            backgroundColor: props.color
        }
        content.push(<div className="tile__color-cap" style={styleObj}></div>)
    }

    if (props.title) content.push(<h3 className="tite__title">{props.title}</h3>)

    if (props.price) content.push(<h4 className="tile_price">{props.price} M</h4>)

    const players = []
    if (props.players) {
        for (const color of props.players) {
            players.push(<div className="player-chip" style={{backgroundColor: color}}></div>)
        }
    }

    content.push(<div className="tile-layout">{players}</div>)

    return (
        <div className={classList.join(" ")}>
            {content}
        </div>
    )
}
