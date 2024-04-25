<template>
    <div class="players-list">
        <PlayerCard
            v-for="player in listPlayers"
            :key="player.username"
            v-bind="player"
            @click="openDealWindow(player.username)" >
        </PlayerCard>
    </div>
</template>

<script>
import PlayerCard from './PlayerCard.vue';

import { mapState, mapMutations } from "vuex"

export default {
    name: "PanelPlayerList",
    components: {
        PlayerCard
    },
    computed: {
        ...mapState([
            "username",
            "game"
        ]),
        
        listPlayers() {
            const { tracker, players } = this.game
            const usernameThis = this.username
            const arr = []

            for (const username of tracker.order) {
                let select = false
                if (tracker.current === username) select = true
                const objCard = Object.assign({}, players[username])
                objCard.select = select
                objCard.username = username
                objCard.pointer = username != usernameThis && tracker.current == usernameThis
                arr.push(objCard)
            }

            return arr
        }
    },
    methods: {
        ...mapMutations("deal", ["openDeal"]),

        openDealWindow(target) {
            if (this.username === target) return
            const currnetPlayer = this.game.tracker.current
            if (currnetPlayer !== this.username) return
            this.openDeal(target)
        }
    }
}
</script>

<style scoped>
.players-list {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}
</style>
