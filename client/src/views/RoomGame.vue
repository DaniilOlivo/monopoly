<template>
    <StatusConnection></StatusConnection>
    <PlayerRegister v-if="stage == 'register'"></PlayerRegister>
    <WaitingList v-if="stage == 'waiting'"></WaitingList>
</template>

__<script>
import StatusConnection from '@/components/devComponents/StatusConnection.vue';
import PlayerRegister from '@/components/gameWindows/PlayerRegister.vue';
import WaitingList from '@/components/gameWindows/WaitingList.vue';
import { socket, state } from "@/socket"

export default {
    name: "RoomGame",
    components: {
        StatusConnection,
        PlayerRegister,
        WaitingList
    },

    mounted() {
        socket.connect()
    },

    computed: {
        stage() {
            return state.stage
        }
    }
}
</script>
