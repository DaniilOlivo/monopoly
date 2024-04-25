<template>
    <div class="container-game-panel">
        <div class="game-panel">
            <p class="status-text" :style="style">
                {{ status }}
            </p>
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

import { mapState } from "vuex"

const mapStatus = {
    firstRoll: "Roll the dice to determine the order of the players",
    waitPlayers: "Waiting for the other players",
    waitMove: "It's your move, ",
    waitOffer: " thinking about buying",
    waitRent: " must pay rent",
    waitDeal: "We are waiting for a decision ",
}

export default {
    name: "PanelMain",
    components: {
        PanelPlayersList,
        PanelRoller,
        PanelLog
    },

    computed: {
        ...mapState([
            "game",
            "username"
        ]),

        status() {
            const {stage, tracker, players} = this.game
            let keyStatus = ""
            if (stage == "start") {
                if (this.username in tracker.valuesDices) keyStatus = "waitPlayers"
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

        style() {
            if (this.stage == "start") return {color: "black", backgroundColor: "transparent"}
            const { players, tracker } = this.game
            return {
                color: "white",
                backgroundColor: players[tracker.current].color.primary
            }
        },

        stage() {
            return this.game.stage
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
    gap: 2em;

    position: sticky;
    top: 0;
    left: 0;
}

.status-text {
    text-align: center;
    padding: 2em 0;
    font-size: 20px;
    color: white;
    font-weight: bold;
}
</style>
