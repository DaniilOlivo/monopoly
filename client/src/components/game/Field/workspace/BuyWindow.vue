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
import { state, socket } from '@/socket';

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
        canBuy() {
            const {game, username} = state
            const moneyPlayer = game.players[username].money
            return moneyPlayer >= this.tile.price
        },

        desc() {
            if (this.canBuy) return "This property is available for purchase"
            else return "You don't have money to buy"
        }
    },
    methods: {
        buy() {
            socket.emit("offer", true)
        },

        refuse() {
            socket.emit("offer", false)
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
