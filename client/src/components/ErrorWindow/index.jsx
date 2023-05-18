import { ModalWindow } from "../Window"

function ErrorWindow(props) {
    let mes = "Sorry, something broke. We are already fixing (no). Try to reload the page"

    if (props.error.message !== undefined) mes = props.error.message

    return (
        <ModalWindow overlap={true}>
            <p class="special-text text-error">{mes}</p>
        </ModalWindow>
    )
}

export default ErrorWindow
