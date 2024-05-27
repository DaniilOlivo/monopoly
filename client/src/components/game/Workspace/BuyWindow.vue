<template>
    <WindowComponent title="Do you want to buy property?">
        <CardDispather :tile="tile"></CardDispather>
        <div class="info">
            <p>Price: <span class="info__cost">{{ tile.price }} M</span></p>
            <p>{{ desc }}</p>
        </div>
        <template v-slot:btns>
            <ButtonMain @click="refuse">Refuse</ButtonMain>
            <ButtonMain @click="buy" :disable="!canBuy">Buy</ButtonMain>
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
            if (this.canBuy) return "This property is available for purchase"
            else return "You don't have money to buy"
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
