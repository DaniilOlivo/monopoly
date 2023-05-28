import "./Window.css"

function Window(props) {
    // props
    // component with children
    // overlap - bool
    let className = "container-window"
    if (props.overlap) className += " container-window_overlap"
    return (
        <div className={className}>
            <div className="window">
                {props.children}
            </div>
        </div>
    )  
}

export default Window
