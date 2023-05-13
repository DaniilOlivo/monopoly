const urlWsConnection = `ws://${document.location.host}`
const ws = new WebSocket(urlWsConnection)

function sendMessage(event, options={}) {
    ws.send(JSON.stringify({event, options}))
}

function register(username) {
    sendMessage("register", {username, titleRoom})
}

function dispatch(message) {
    const {event, options} = message
    if (event == "confirm_login") confirmUsername(options)
    if (event == "data_room") {
        room = options
        openListRoom()
    }
}

ws.onmessage = (e) => {
    let message = JSON.parse(e.data)
    console.log(message)
    dispatch(message)
}

ws.onerror = (error) => openErrorWindow(error)
