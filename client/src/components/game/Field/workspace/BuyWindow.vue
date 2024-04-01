<template>
    <WindowComponent :modal="false" >
        <CardDispather :tile="tile"></CardDispather>
        <div class="info">
            <p>Price: <span class="info__cost">{{ tile.price }} M</span></p>
            <p>{{ desc }}</p>
        </div>
        <template v-slot:btns>
            <ButtonMain title="Refuse" @click="refuse"></ButtonMain>
            <ButtonMain title="Buy" @click="buy" :disable="!canBuy"></ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import CardDispather from '../cards/CardDispather.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';

import { mapState } from "vuex"
import { gameApi } from '@/socket';

export default {
    name: "BuyWindow",
    components: {
        WindowComponent,
        CardDispather,
        ButtonMain
    },
    props: {
        tile: Object
    },
    computed: {
        ...mapState([
            "game",
            "username"
        ]),

        canBuy() {
            const moneyPlayer = this.game.players[this.username].money
            return moneyPlayer >= this.tile.price
        },

        desc() {
            if (this.canBuy) return "This property is available for purchase"
            else return "You don't have money to buy"
        }
    },
    methods: {
        buy() {
            gameApi("buy", true)
        },

        refuse() {
            gameApi("buy", false)
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
