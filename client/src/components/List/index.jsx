import "./List.css"

function List(props) {
    let items = []

    if (props.clickable) 
        for (const [title, handler] of Object.entries(props.items)) {
            items.push(<h3 className="container-list__item" onClick={handler} key={title}>{title}</h3>)
        }
    else for (const title of props.items) {
        items.push(<h3 className="container-list__item" key={title}>{title}</h3>)
    }

    let className = "container-list"
    if (props.clickable) className += " container-list_clickable"

    return (
        <div className="list">
            <h2 className="title-list">{props.title}:</h2>

            <div className={className}>
                {items}
            </div>
        </div>
    )
}

export default List
