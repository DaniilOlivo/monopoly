import "./Window.css"

export function Window(props) {
    return (
        <div className="window">
            {props.children}
        </div>
    )
}

export function ModalWindow(props) {
    let className = "container-window"
    if (props.overlap) className += " container-window_overlap"
    return (
        <div className={className}>
            <Window>{props.children}</Window>
        </div>
    )  
}
