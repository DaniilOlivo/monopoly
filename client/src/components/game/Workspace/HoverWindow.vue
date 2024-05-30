<template>
    <WindowComponent>
        <CardDispather :tile="tile"></CardDispather>
        <div class="info">
            <p v-if="tile.owner">
                Это собственность принадлежит 
                <span class="hover-window__owner" :style="{color: colorOwner}">{{ tile.owner }}</span>
            </p>
            <p v-if="monopoly">Игроку принадлежат все клетки этого цвета</p>
            <p class="info_warning" v-if="tile.pledge">Собственность заложена</p>
        </div>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import CardDispather from '../cards/CardDispather.vue';

import { mapState, mapGetters } from 'vuex';

export default {
    name: "HoverWindow",
    components: {
        WindowComponent,
        CardDispather
    },
    computed: {
        ...mapState(["game"]),

        ...mapGetters(["thisPlayer"]),

        ...mapGetters("workspace", {tile: "cardHover"}),

        colorOwner() {
            return this.game.players[this.tile.owner].color.secondary ?? "black"
        },

        monopoly() {
            if (!this.tile.color) return false
            const monopoly = this.thisPlayer.monopoly[this.tile.color]
            return monopoly == this.tile.numberTilesArea
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
