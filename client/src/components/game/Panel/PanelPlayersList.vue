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
import { state } from "@/socket"
import { store } from '@/store';

export default {
    name: "PanelPlayerList",
    components: {
        PlayerCard
    },
    computed: {
        listPlayers() {
            const { tracker, players } = state.game
            const usernameThis = state.username
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
            const { username } = state
            if (username === target) return
            store.openDealWindow(target)
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
