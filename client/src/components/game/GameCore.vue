<template>
    <h1>Start game</h1>
</template>

<script>
import { state } from "@/socket"

export default {
    name: "GameCore",
    mounted() {
        console.log(state.messages.GameCore)
    }
}
</script>
