<template>
    <WindowComponent :modal="false">
        <CardDispather :tile="tile"></CardDispather>
        <div class="info">
            <p v-if="tile.owner">
                This tile belongs to 
                <span class="hover-window__owner" :style="{color: colorOwner}">{{ tile.owner }}</span>
            </p>
            <p v-if="monopoly">The player owns all the squares of that color</p>
            <p class="info_warning" v-if="tile.pledge">Property is mortgaged</p>
        </div>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import CardDispather from '../cards/CardDispather.vue';

import { mapState } from 'vuex';

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
        ...mapState([
            "username",
            "game"
        ]),

        colorOwner() {
            let color = "black"
            color = this.game.players[this.tile.owner].color
            return color
        },
        monopoly() {
            if (!this.tile.color) return false
            const monopoly = this.game.players[this.username].monopoly[this.tile.color]
            const count = this.tile.count
            return monopoly == count
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
