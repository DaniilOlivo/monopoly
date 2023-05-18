import { useState, useEffect } from "react"

import Menu from './Menu';
import Game from "./Game";

import './App.css';

function App() {
  const [idModule, setIdModule] = useState("menu")
  const [room, setRoom] = useState("")
  
  const startGameModule = (titleRoom) => {
    setIdModule("game")
    setRoom(titleRoom)
  }

  const startMenuModule = () => {
    setIdModule("menu")
    setRoom("")
  }

  // Temporary code to go directly to the game module
  useEffect(() => {
    async function createRoom() {
      const response = await fetch("/api/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({room: "Room"})
      })

      startGameModule("Room")
    }
    createRoom()
  }, [])

  const modules = {
    "menu": < Menu startGameModule={startGameModule} />,
    "game": < Game room={room} goBack={startMenuModule} />
  }

  return (
    <div className="app">
      {modules[idModule]}
    </div>
  )
}

export default App;
