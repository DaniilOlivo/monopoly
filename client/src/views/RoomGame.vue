<template>
    <StatusConnection></StatusConnection>
</template>

<script>
import StatusConnection from '@/components/devComponents/StatusConnection.vue';
import { socket } from "@/socket"

export default {
    name: "RoomGame",
    components: {
        StatusConnection
    },
    mounted() {
        socket.connect()
    }
}
</script>
