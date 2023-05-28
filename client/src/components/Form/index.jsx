import Button from "../Button"

import "./Form.css"

function Form(props) {
    // props
    // parameter - label input, str
    // btns - title btn and handler, obj
    // value - str or number
    // onChange - func change value
    // desc - description, str
    // error - str
    const param = props.parameter
    const idInput = param.toLowerCase()

    const arrBtns = []
    for (const [title, handler] of Object.entries(props.btns)) {
        arrBtns.push(< Button title={title} onClick={handler} />)
    }

    return (
        <div className="form">
            <div className="form__input">
                <label htmlFor={idInput}>{param}:</label>
                <input type="text" value={props.value} onChange={(e) => props.onChange(e.target.value)} />
            </div>

            <p className="special-text form__info form__desc">{props.desc}</p>
            <p className="special-text form__info form__error">{props.error}</p>

            <div className="panel-control">
                {arrBtns}
            </div>
        </div>
    )
}

export default Form
