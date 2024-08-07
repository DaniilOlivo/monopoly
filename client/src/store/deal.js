function getEmptyObjectDeal() {
    return {
      active: false,
      initiator: null,
      target: null,
      income: [],
      host: [],
      moneyIncome: 0,
      moneyHost: 0
    }
  }

export default {
    namespaced: true,
    state: {
        localObjectDeal: getEmptyObjectDeal(),
    },

    getters: {
        activeDeal(state) {
            return state.localObjectDeal.active
        }
    },

    mutations: {
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

        dealAddTile(state, { side, idTile }) {
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
        addTile({ commit, state, rootState }, { owner, id }) {
            const { initiator, target } = state.localObjectDeal
            if (initiator) return
            if (owner === target) commit(
                "dealAddTile", {side: "host", idTile: id})
            if (owner === rootState.username) commit(
                "dealAddTile", {side: "income", idTile: id})
        }
    }
}