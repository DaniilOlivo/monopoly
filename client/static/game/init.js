function initLoginUsername() {
    const btn = document.querySelector(".btn_username")
    const input = document.querySelector("#username")
    const textError = document.querySelector(".text-error-username")

    btn.addEventListener("click", () => {
        let result = input.value
        username = result
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

function openListRoom() {
    const window = document.querySelector(".window_list-room")
    const title = document.querySelector(".title_list-room")
    const list = document.querySelector(".list_room")
    const btn = document.querySelector(".btn_start-game")

    window.classList.remove("window_disable")
    title.textContent = `${titleRoom}. ${room.length}/8`
    list.innerHTML = ""
    for (const player of room) {
        let h = document.createElement("h3")
        h.classList.add("list__item")
        h.textContent = player
        list.appendChild(h)
    }

    if (username == host) {
        btn.classList.remove("btn_disable")
    }

    btn.addEventListener("click", () => {
        window.classList.add("window_disable")
        console.log("Start Game")
    })
}

initLoginUsername()
