import { createStore } from 'vuex'

import deal from "./deal"
import workspace from "./workspace"
import field from './field'

const stages = {
  queue: [
    "register",
    "waiting",
    "game"
  ],
  cursor: 0
}

export default createStore({
  state: {
    connection: false,
    username: "",
    stage: "register",
    service: {
      "register": "",
      "waiting": null
    },
    game: null,
    previousGame: null,
    consoleDevOpen: false,
  },
  getters: {
    thisPlayer(state) {
      return state.game.players[state.username]
    },

    thisPlayerTurn(state) {
      return state.username == state.game.tracker.current
    },

    tilesMonopoly: (state) => color => {
      return state.game.field.tiles.filter(tile => tile.color == color)
    },

    monopolyAnyBuilding: (state, getters) => color => {
      const tiles = getters.tilesMonopoly(color)
      let flag = false
      for (const tile of tiles) {
        if (tile.building > 0) {
          flag = true
          break
        }
      }
      return flag
    }
  },
  mutations: {
    setConnection(state, val) {
      state.connection = val
    },

    setUsername(state, val) {
      state.username = val
    },

    nextStage(state) {
      const newCursor = stages.cursor + 1
      if (newCursor >= stages.queue.length) return
      stages.cursor = newCursor
      state.stage = stages.queue[newCursor]
    },

    setService(state, { service, value }) {
      state.service[service] = value
    },

    setGame(state, game) {
      state.previousGame = state.game
      state.game = game
    },
    setConsole(state, isOpen) {
      state.consoleDevOpen = isOpen
    }
  },
  actions: {
  },
  modules: {
    deal,
    workspace,
    field
  }
})
