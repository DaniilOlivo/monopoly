<template>
    <div class="player-chip" :style="{backgroundColor: color}">
        <img :src="ArrestIcon" v-if="arrested">
    </div>
</template>

<script>
import ArrestIcon from "./img/arrest.png"

export default {
    name: "PlayerChip",

    props: {
        color: String,
        arrested: Boolean
    },

    data() {
        return {ArrestIcon}
    }
}
</script>

<style scoped>
.player-chip {
    width: 30px;
    height: 30px;
    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
