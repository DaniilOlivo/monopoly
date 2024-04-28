export default {
    namespaced: true,
    state: {
        startPos: null,
        endPos: null,
        color: null,
        username: null,
    },

    getters: {
        readyMove(state) {
            return state.startPos != null && state.endPos != null
        }
    },

    mutations: {
        setStartPos(state, pos) {
            state.startPos = pos
        },
        setEndPos(state, pos) {
            state.endPos = pos
        },
        setPlayer(state, { color, username }) {
            state.color = color
            state.username = username
        },
        clear(state) {
            state.startPos = null
            state.endPos = null
            state.color = null
            state.username = null
        }
    }
}