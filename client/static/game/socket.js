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
    if (event == "data_room") initRoom(options)
}

ws.onmessage = (e) => {
    let message = JSON.parse(e.data)
    console.log(message)
    dispatch(message)
}

// It is called in init.js, where as an argument it is given a function that will display the error to the client
// This is done in order to separate the socket logic and the initialization logic of html elements
function configureOutputError(funcOnError) {
    ws.onerror = funcOnError
}
