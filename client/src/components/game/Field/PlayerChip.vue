<template>
    <div class="player-chip" :style="style" :class="{'player-chip_active': active}">
        <img :src="ArrestIcon" v-if="arrested">
    </div>
</template>

<script>
import { mapState } from "vuex"

import ArrestIcon from "./img/arrest.png"

export default {
    name: "PlayerChip",

    props: {
        username: String,
        color: Object,
        arrested: Boolean
    },

    data() {
        return {ArrestIcon}
    },

    computed: {
        ...mapState(["game"]),

        style() {
            return {
                backgroundColor: this.color.primary,
                borderColor: this.color.secondary
            }
        },

        active() {
            return this.game.tracker.current == this.username
        }
    }
}
</script>

<style scoped>
@keyframes activeChip {
    from {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    to {
        transform: scale(1);
    }
}

.player-chip {
    width: 30px;
    height: 30px;
    border-radius: 50%;

    display: flex;
    justify-content: center;
    align-items: center;

    border-width: 4px;
    border-style: solid;

    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
}

.player-chip_active {
    animation: activeChip infinite 1s;
}
</style>
