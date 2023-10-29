import axios from "axios"

const baseUrl = "/api"

export async function createRoom(title) {
    if (!title) return {ok: false, desc: "Did not enter the name of the room"}
    const url = baseUrl + "/create"
    const response = await axios.post(url, {title})
    return response.data
}

export async function getListRooms() {
    const url = baseUrl + "/list"
    const response = await axios.get(url)
    return response.data
}
