import { useState } from "react"

import Menu from './Menu';
import GameManager from "./GameManager"

import './App.css';

import { useSkipCreateRoom } from "./utils/skip";

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
  useSkipCreateRoom(startGameModule)

  const modules = {
    "menu": < Menu startGameModule={startGameModule} />,
    "game": < GameManager room={room} goBack={startMenuModule} />
  }

  return (
    <div className="app">
      {modules[idModule]}
    </div>
  )
}

export default App;
