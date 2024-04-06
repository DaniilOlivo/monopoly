<template>
    <StatusConnection></StatusConnection>
    <component :is="currentComponent"></component>
</template>

<script>
import StatusConnection from '@/components/devComponents/StatusConnection.vue';
import PlayerRegister from '@/components/services/PlayerRegister.vue';
import WaitingList from '@/components/services/WaitingList.vue';
import GameCore from "@/components/game/GameCore.vue";
import OopsWindow from '@/components/services/OopsWindow.vue';

import { socket } from "@/socket"
import { mapState } from "vuex"

export default {
    name: "RoomGame",
    components: {
        StatusConnection,
        PlayerRegister,
        WaitingList,
        GameCore,
        OopsWindow
    },

    mounted() {
        socket.connect()
    },

    computed: {
        ...mapState([
            "stage",
            "game"
        ]),
        currentComponent() {
            const mapStage = {
                "register": "PlayerRegister",
                "waiting": "WaitingList",
                "game": "GameCore"
            }

            let currentComponent = mapStage[this.stage]
            if (!currentComponent) return "OopsWindow"
            if (this.stage === "game" && !this.game) return "OopsWindow"
            
            return currentComponent
        }
    }
}
</script>
