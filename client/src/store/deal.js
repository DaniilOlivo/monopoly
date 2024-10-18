function getEmptyObjectDeal() {
    return {
      initiator: {
        username: null,
        property: [],
        money: 0
      },
      target: {
        username: null,
        property: [],
        money: 0
      },
    }
  }

export default {
    namespaced: true,
    state: {
        active: false,
        mode: "create",
        localObjectDeal: getEmptyObjectDeal(),
    },

    mutations: {
        setActive(state, value) {
            state.active = value
        },

        setMode(state, mode) {
            if (mode == "create" || mode == "income") state.mode = mode
        },

        setUsername(state, {side, username}) {
            state.localObjectDeal[side].username = username
        },

        setObjDeal(state, obj) {
            state.localObjectDeal = obj
        },

        dealAddTile(state, { side, idTile }) {
            const listOwn = state.localObjectDeal[side].property
            if (listOwn.includes(idTile)) return
            listOwn.push(idTile)
        },

        dealDeleteTile(state, { side, index }) {
            state.localObjectDeal[side].property.splice(index, 1)
        },

        setMoney(state, {side, amount}) {
            state.localObjectDeal[side].money = amount
        }
    },
    actions: {
        openDeal({ commit, rootState }, usernameTarget) {
            commit("setActive", true)
            commit("setMode", "create")
            commit("setUsername", {
                side: "initiator",
                username: rootState.username
            })
            commit("setUsername", {
                side: "target",
                username: usernameTarget
            })
        },

        closeDeal({ commit }) {
            commit("setActive", false)
            commit("setObjDeal", getEmptyObjectDeal())
        },

        setDeal({ commit }, {obj, mode}) {
            commit("setActive", true)
            commit("setMode", mode)
            commit("setObjDeal", obj)
        },

        addTile({ commit, state, rootState }, { owner, id }) {
            if (state.mode == "income") return
            if (owner === state.localObjectDeal.target.username) commit(
                "dealAddTile", {side: "target", idTile: id})
            if (owner === rootState.username) commit(
                "dealAddTile", {side: "initiator", idTile: id})
        }
    }
}