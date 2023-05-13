function initLoginUsername() {
    const windowRegister = document.querySelector(".container-window_register")
    const btn = document.querySelector(".btn_username")
    const input = document.querySelector("#username")
    const textError = document.querySelector(".text-error-username")

    btn.addEventListener("click", () => {
        let result = input.value
        if (result) {
            register(input.value)
            windowRegister.classList.add("container-window_disable")
        } else {
            textError.textContent = "Please write your username"
        }
    })
}

function initErrorWindow() {
    const container = document.querySelector(".container-window_error")
    const errorText = document.querySelector(".error_text")
    configureOutputError((error) => {
        let mes = "Sorry, something broke. We are already fixing (no). Try to reload the page"
        if (error.message !== undefined) mes = error.message
        errorText.textContent = mes
        container.classList.remove("container-window_disable")
    })
}

function init() {
    initErrorWindow()
    initLoginUsername()
} 

init()
