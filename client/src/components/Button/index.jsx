import "./Button.css"

function Button(props) {    
    // props
    // title - str
    // disable - bool
    // onClick - func(event)
    return (
        <button className="button" disabled={props.disable} onClick={props.onClick}>
            {props.title}
        </button>
    )
}

export default Button
