import "./Button.css"

function Button(props) {    
    return (
        <button className="button" disabled={props.disable} onClick={props.onClick}>
            {props.title}
        </button>
    )
}

export default Button
