import { createStore } from 'vuex'

const stages = {
  queue: [
    "register",
    "waiting",
    "game"
  ],
  cursor: 0
}

function getEmptyObjectDeal() {
  return {
    active: false,
    initiator: "",
    target: "",
    income: [],
    host: [],
    moneyIncome: 0,
    moneyHost: 0
  }
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
    localObjectDeal: getEmptyObjectDeal(),
  },
  getters: {
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

    openDeal(state, usernameTarget) {
      state.localObjectDeal.active = true
      state.localObjectDeal.target = usernameTarget
    },

    closeDeal(state) {
      state.localObjectDeal = getEmptyObjectDeal()
    },

    setDeal(state, objDeal) {
      if (state.localObjectDeal.active) return
      state.localObjectDeal = objDeal
    },

    dealAddTile(state, { side, idTile}) {
      const listOwn = state.localObjectDeal[side]
      if (listOwn.includes(idTile)) return
      listOwn.push(idTile)
    },

    dealDeleteTile(state, { side, index }) {
      state.localObjectDeal[side].splice(index, 1)
    },

    setMoney(state, {side, amount}) {
      const keySide = "money" + side[0].toUpperCase() + side.slice(1)
      state.localObjectDeal[keySide] = amount
    }
  },
  actions: {
  },
  modules: {
  }
})
