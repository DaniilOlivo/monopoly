export default {
    namespaced: true,
    state: {
        selectOwnIndex: -1,
        cardHoverIndex: -1,
    },

    getters: {
        getTile: (state, getters, rootState) => index => {
            if (index != -1) {
                return rootState.game.field.tiles[index]
            }
            return null
        },

        selectOwn(state, getters) {
            return getters.getTile(state.selectOwnIndex)
        },

        cardHover(state, getters) {
            return getters.getTile(state.cardHoverIndex)
        }
    },
    mutations: {
        hover(state, indexTile) {
            state.cardHoverIndex = indexTile
        },

        unhover(state) {
            state.cardHoverIndex = -1
        },

        select(state, indexTile) {
            state.selectOwnIndex = indexTile
        },

        unselect(state) {
            state.selectOwnIndex = -1
        }
    },
    actions: {
    }
}