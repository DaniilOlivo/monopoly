import { useState } from "react"

import Window from "../../../components/Window";
import Form from "../../../components/Form";

import { useSkipLoginRoom } from "../../../utils/skip";

function LoginWindow(props) {
    const [value, setValue] = useState("")

    function register() {
        if (!value) return
        props.sendMes("register", {username: value, titleRoom: props.room})
    }

    let error = ""
    const mes = props.mes
    if (mes && mes.event === "confirm_login") {
        if (mes.options.confirm) props.login(value)
        else error = mes.options.info
    }

    useSkipLoginRoom(setValue, register, mes)

    const mapBtns = {
        "Back": props.goBack,
        "Login": register
    }

    return (
        <Window>
            < Form
                parameter="Username"
                value={value}
                onChange={setValue}
                btns={mapBtns}
                error={error}
                 />
        </Window>
    )
}

export default LoginWindow
