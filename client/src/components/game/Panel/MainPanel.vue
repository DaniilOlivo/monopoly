<template>
    <div class="container-game-panel">
        <div class="game-panel">
            <p class="status-text">{{ status }}</p>
            <PanelPlayersList v-show="stage == 'main'"></PanelPlayersList>
            <PanelRoller></PanelRoller>
            <PanelLog></PanelLog>
        </div>
    </div>
    
</template>

<script>
import PanelPlayersList from './PanelPlayersList.vue';
import PanelRoller from './PanelRoller.vue';
import PanelLog from './PanelLog.vue';

import { state } from "@/socket"

const mapStatus = {
    firstRoll: "Roll the dice to determine the order of the players",
    waitPlayers: "Waiting for the other players",
    waitMove: "It's your move, ",
    waitOffer: " thinking about buying",
    waitRent: " must pay rent",
    waitDeal: "We are waiting for a decision ",
}

export default {
    name: "MainPanel",
    components: {
        PanelPlayersList,
        PanelRoller,
        PanelLog
    },

    computed: {
        status() {
            const {stage, tracker, players} = state.game
            let keyStatus = ""
            if (stage == "start") {
                if (state.username in tracker.valuesDices) keyStatus = "waitPlayers"
                else keyStatus = "firstRoll"
            } else {
                const service = players[tracker.current].service
                if (service.offer) keyStatus = "waitOffer"
                else if (service.rent) keyStatus = "waitRent"
                else keyStatus = "waitMove"
            }

            let target = ""
            for (const { service } of Object.values(players)) {
                if (service.deal) {
                    target = service.deal.target
                    keyStatus = "waitDeal"
                    break
                }
            }

            let textStatus = mapStatus[keyStatus]

            if (keyStatus == "waitMove") textStatus += tracker.current
            if (keyStatus == "waitOffer" || keyStatus == "waitRent") textStatus = tracker.current + textStatus
            if (keyStatus == "waitDeal") textStatus += target

            return textStatus
        },

        stage() {
            return state.game.stage
        }
    }
}
</script>

<style scoped>
.container-game-panel {
    flex-grow: 1;

    position: relative;
}

.game-panel {
    display: flex;
    flex-direction: column;
    gap: 40px;

    position: sticky;
    top: 0;
    left: 0;
}

.status-text {
    text-align: center;
    margin-top: 50px;
    font-size: 20px;
}
</style>
