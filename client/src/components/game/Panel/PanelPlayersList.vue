<template>
    <div class="players-list">
        <PlayerCard
            v-for="player in listPlayers"
            :key="player.username"
            v-bind="player" >
        </PlayerCard>
    </div>
</template>

<script>
import PlayerCard from './PlayerCard.vue';
import { state } from "@/socket"

export default {
    name: "PanelPlayerList",
    components: {
        PlayerCard
    },
    computed: {
        listPlayers() {
            const { tracker, players } = state.game
            const arr = []

            for (const username of tracker.order) {
                let select = false
                if (tracker.current === username) select = true
                const objCard = Object.assign({}, players[username])
                objCard.select = select
                objCard.username = username
                arr.push(objCard)
            }

            return arr
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
