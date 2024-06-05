import { createStore } from 'vuex'

import deal from "./deal"
import workspace from "./workspace"
import field from './field'

export default createStore({
  state: {
    connection: false,
    username: "",
    service: {
      "register": "",
      "waiting": null
    },
    game: null,
    previousGame: null,
    consoleDevOpen: false,
  },
  getters: {
    stage(state) {
      const { username, game } = state
      if (username && game) {
        return (game.stage == "end") ? "end" : "game"
      }
      if (username && !game) return "lobby"
      if (!username && game) return "reconnect"
      if (!username && !game) return "register"
    },

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
