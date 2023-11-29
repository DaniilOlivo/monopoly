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
    waitMove: "It's your move, "
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
            const {stage, tracker} = state.game
            let keyStatus = ""
            if (stage == "start") {
                if (state.username in tracker.valuesDices) keyStatus = "waitPlayers"
                else keyStatus = "firstRoll"
            } else keyStatus = "waitMove"

            let textStatus = mapStatus[keyStatus]

            if (keyStatus == "waitMove") textStatus += tracker.current

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
