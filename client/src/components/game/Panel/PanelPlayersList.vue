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

import { mapState } from "vuex"

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
                objCard.pointer = username != usernameThis
                arr.push(objCard)
            }

            return arr
        }
    },
    methods: {
        openDealWindow(target) {
            if (this.username === target) return
            const currnetPlayer = this.game.tracker.current
            if (currnetPlayer !== this.username) return
            this.$store.commit("openDeal", target)
        }
    }
}
</script>

<style scoped>
.players-list {
    padding: 30px 20px 40px;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);

    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>
