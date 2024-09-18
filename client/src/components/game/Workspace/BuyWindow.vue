<template>
    <WindowComponent :title="$t('game.buy.title') + '?'">
        <CardDispather :tile="tile"></CardDispather>
        <div class="info">
            <p>{{ $t("game.buy.price") }}: <span class="info__cost">{{ tile.price }} M</span></p>
            <p>{{ $t("game.buy." + desc) }}</p>
        </div>
        <template v-slot:btns>
            <ButtonMain @click="refuse">{{ $t("game.buy.refuse") }}</ButtonMain>
            <ButtonMain @click="buy" :disable="!canBuy">{{ $t("game.buy.buy") }}</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';
import CardDispather from '../cards/CardDispather.vue';

import { mapGetters } from "vuex"
import { gameApi } from '@/socket';

export default {
    name: "BuyWindow",
    components: {
        WindowComponent,
        CardDispather,
        ButtonMain
    },
    computed: {
        ...mapGetters(["thisPlayer"]),

        tile() {
            return this.thisPlayer.service.offer
        },

        canBuy() {
            return this.thisPlayer.money >= this.tile.price
        },

        desc() {
            if (this.canBuy) return "canBuy"
            else return "noMoney"
        }
    },
    methods: {
        buy() {
            gameApi("buy", {next: true})
        },

        refuse() {
            gameApi("buy", {refuse: true, next: true})
        }
    }
}
</script>

<style scoped>
.info__cost {
    font-weight: bold;
}

.info p {
    text-align: center;
}
</style>
