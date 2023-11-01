module.exports = function connect(socket) {
    console.log("Connect socket")

    socket.on("register", (username, title) => {
        
    })

    socket.on('disconnecting', () => {
        console.log(socket.rooms)
    })

    socket.on("disconnect", () => console.log("Disconnect"))
}


