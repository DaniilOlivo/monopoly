<template>
    <StatusConnection></StatusConnection>
    <PlayerRegister v-if="stage == 'register'"></PlayerRegister>
    <WaitingList v-if="stage == 'waiting'"></WaitingList>
    <GameCore v-if="stage == 'game' && game"></GameCore>
</template>

<script>
import StatusConnection from '@/components/devComponents/StatusConnection.vue';
import PlayerRegister from '@/components/gameWindows/PlayerRegister.vue';
import WaitingList from '@/components/gameWindows/WaitingList.vue';
import GameCore from "@/components/game/GameCore.vue"

import { socket } from "@/socket"
import { mapState } from "vuex"

export default {
    name: "RoomGame",
    components: {
        StatusConnection,
        PlayerRegister,
        WaitingList,
        GameCore
    },

    mounted() {
        socket.connect()
    },

    computed: mapState([
        "stage",
        "game"
    ])
}
</script>
