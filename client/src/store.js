import { reactive } from "vue"

import { socket, state } from "./socket"

// Simple implementation of global storage
// I didn’t want to complicate the code and connect Vuex
// You can judge me for my laziness)
export const store = {
    state: reactive({
        objDeal: null,
    }),

    openDealWindow(usernameTarget) {
        const { username, game } = state
        if (this.state.objDeal || game.tracker.current !== username) return
        this.state.objDeal = {
            initiator: null,
            target: usernameTarget,
            income: [],
            host: [],
            moneyIncome: 0,
            moneyHost: 0
        }
    },

    setObjDeal(objDeal) {
        if (this.state.objDeal) return
        this.state.objDeal = objDeal
    },

    closeDealWindow() {
        this.state.objDeal = null
    },

    addIdTile(side, idTile) {
        const addTile = (arrList, idTile) => {
            if (arrList.includes(idTile)) return
            arrList.push(idTile)
        }

        if (side === "income") addTile(this.state.objDeal.income, idTile)
        if (side === "host") addTile(this.state.objDeal.host, idTile)
    },

    deleteIdTile(side, index) {
        if (side === "income") this.state.objDeal.income.splice(index, 1)
        if (side === "host") this.state.objDeal.host.splice(index, 1)
    },

    setMoney(side, val) {
        if (side === "income") this.state.objDeal.moneyIncome = val
        if (side === "host") this.state.objDeal.moneyHost = val
    },

    dealSocket() {
        socket.emit("deal", this.state.objDeal)
        this.state.objDeal = null
    },

    refuseTradeSocket() {
        socket.emit("trade", false)
        this.state.objDeal = null
    },

    acceptTradeSocket() {
        socket.emit("trade", true)
        this.state.objDeal = null
    },
}