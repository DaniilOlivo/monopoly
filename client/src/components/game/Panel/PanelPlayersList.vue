<template>
    <div class="players-list">
        <PlayerCard
            v-for="player in listPlayers"
            :key="player.username"
            v-bind="player"
            :labelHover="$t('game.panel.playersList.' + (player.username === username ? 'info' : 'offer'))"
            @click="clickCard(player.username)" >
        </PlayerCard>
    </div>
</template>

<script>
import PlayerCard from './PlayerCard.vue';

import { mapState, mapMutations, mapActions } from "vuex"

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
                objCard.pointer = username == usernameThis || tracker.current == usernameThis
                arr.push(objCard)
            }

            return arr
        }
    },
    methods: {
        ...mapActions("deal", ["openDeal"]),
        ...mapMutations("workspace", ["showDialog"]),

        clickCard(username) {
            if (this.username === username) {
                this.showDialog("PlayerWindow")
            } else {
                const currnetPlayer = this.game.tracker.current
                if (currnetPlayer !== this.username) return
                this.openDeal(username)
            }
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
