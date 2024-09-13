<template>
    <component :is="currentComponent"></component>
</template>

<script>
import PlayerRegister from '@/components/services/PlayerRegister.vue';
import WaitingList from '@/components/services/WaitingList.vue';
import GameCore from "@/components/game/GameCore.vue";
import OopsWindow from '@/components/services/OopsWindow.vue';
import EndWindow from '@/components/services/EndWindow.vue'

import { socket } from "@/socket"
import { mapGetters } from "vuex"

export default {
    name: "RoomGame",
    components: {
        PlayerRegister,
        WaitingList,
        GameCore,
        OopsWindow,
        EndWindow
    },

    mounted() {
        // We check if the game is already running, in case we reconnect
        socket.emit("pingGame", this.$router.currentRoute.value.params.room)
    },

    computed: {
        ...mapGetters(["stage"]),

        currentComponent() {
            const mapStage = {
                "register": "PlayerRegister",
                "lobby": "WaitingList",
                "game": "GameCore",
                "end": "EndWindow"
            }
            console.log(this.stage)
            let currentComponent = mapStage[this.stage]
            if (!currentComponent) return "OopsWindow"
            
            return currentComponent
        }
    }
}
</script>
