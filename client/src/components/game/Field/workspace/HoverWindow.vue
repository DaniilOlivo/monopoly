<template>
    <WindowComponent :modal="false">
        <CardDispather :tile="tile"></CardDispather>
        <div class="info">
            <p v-if="tile.owner">
                This tile belongs to 
                <span class="hover-window__owner" :style="{color: colorOwner}">{{ tile.owner }}</span>
            </p>
            <p class="info_warning" v-if="tile.pledge">Property is mortgaged</p>
        </div>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import CardDispather from '../cards/CardDispather.vue';

import {state} from "@/socket"

export default {
    name: "HoverWindow",
    components: {
        WindowComponent,
        CardDispather
    },
    props: {
        tile: Object
    },
    computed: {
        colorOwner() {
            let color = "black"
            color = state.game.players[this.tile.owner].color
            return color
        }
    }
}
</script>

<style scoped>
.info {
    text-align: center;
}

.info_warning {
    color: brown;
    font-weight: bold;
}
.hover-window__owner {
    font-weight: bold;
}
</style>
