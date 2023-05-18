import "./Button.css"

function Button(props) {
    let classList = ["button"]
    if (props.disable) {
        classList.push("button_disable")
    }
    
    return (
        <button className={classList.join(" ")} onClick={props.onClick}>
            {props.title}
        </button>
    )
}

export default Button
