const url = "/listRooms/"

const listRoomsDiv = document.querySelector(".list-rooms")

async function getListRooms() {
    let response = await fetch(url)
    let listRooms = await response.json()

    for (const room of listRooms) {
        let h = document.createElement("h3")
        h.classList.add("room")
        h.textContent = room

        let a = document.createElement("a")
        a.setAttribute("href", `/game/${room}/`)
        a.appendChild(h)

        listRoomsDiv.appendChild(a)

        // <a href="/"><h3 class="room">Test</h3></a>
    }
}

getListRooms()
