import "./List.css"

function BaseList(props) {
    let className = "container-list"
    if (props.containerClassName) className += " " + props.containerClassName

    return (
        <div className="list">
            <h2 className="title-list">{props.title}:</h2>

            <div className={className}>
                {props.items}
            </div>
        </div>
    )
}

export function ListSimple(props) {
    let items = []

    for (const title of props.items) {
        items.push(<h3 className="container-list__item" key={title}>{title}</h3>)
    }

    return < BaseList title={props.title} items={items} />
}

export function ListExtend(props) {
    let items = []
    let clickable = false

    for (const [title, options] of Object.entries(props.items)) {
        const { handler, additionalTitle } = options
        if (handler) clickable = true
        let contentItem = [<span>{title}</span>]
        if (additionalTitle) contentItem.push(<span>{additionalTitle}</span>)
        items.push(<h3 className="container-list__item" onClick={handler} key={title}>{contentItem}</h3>)
    }

    let className = null
    if (clickable) className = "container-list_clickable"

    return < BaseList title={props.title} items={items} containerClassName={className} />
}
