<template>
    <div class="connection">
        Connection: <span :class="connection ? 'con_on' : 'con_off'">{{ connection }}</span>
    </div>
</template>

<script>
import { state } from "@/socket"

export default {
    name: "StatusConnection",
    computed: {
        connection() {
            return state.connection
        }
    }
}
</script>

<style scoped>
    .connection {
        background-color: white;
        box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
        padding: 20px 30px;
        border-radius: 10px;
        position: fixed;
        z-index: 20;
    }

    .con_on {
        color: green;
    }

    .con_off {
        color: darkred;
    }
</style>

