import { createStore } from 'vuex'

import deal from "./deal"

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
    deal
  }
})
