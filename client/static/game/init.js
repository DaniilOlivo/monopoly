function initLoginUsername() {
    const btn = document.querySelector(".btn_username")
    const input = document.querySelector("#username")
    const textError = document.querySelector(".text-error-username")

    btn.addEventListener("click", () => {
        let result = input.value
        if (result) register(input.value)
        else textError.textContent = "Please write your username"
    })
}

function confirmUsername(data) {
    const windowRegister = document.querySelector(".container-window_register")
    const textError = document.querySelector(".text-error-username")
    if (data.confirm) windowRegister.classList.add("container-window_disable")
    else textError.textContent = data.info
}

function openErrorWindow(error) {
    const container = document.querySelector(".container-window_error")
    const errorText = document.querySelector(".error_text")
    let mes = "Sorry, something broke. We are already fixing (no). Try to reload the page"
    if (error.message !== undefined) mes = error.message
    errorText.textContent = mes
    container.classList.remove("container-window_disable")
}

initLoginUsername()
