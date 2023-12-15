<template>
    <WindowComponent :modal="false">
        <CardDispather :tile="tile"></CardDispather>
        <div class="info">
            <p class="info_warning" v-if="pledge">Property is mortgaged</p>
        </div>
        <template v-slot:btns>
            <ButtonMain title="Close" @click="closeOwn"></ButtonMain>
            <ButtonMain title="Sell" @click="clickSell"></ButtonMain>
            <ButtonMain title="Redeem Pledge" @click="clickRedeemPledge" v-if="pledge"></ButtonMain>
            <ButtonMain title="Put Pledge" @click="clickPutPledge" v-else></ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import CardDispather from '../cards/CardDispather.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';

import { socket } from "@/socket"

export default {
    name: "OwnWindwow",
    components: {
        WindowComponent,
        CardDispather,
        ButtonMain
    },
    props: {
        tile: Object
    },
    methods: {
        clickSell() {
            socket.emit("sell", this.tile.id)
        },
        clickPutPledge() {
            socket.emit("putPledge", this.tile.id)
        },
        clickRedeemPledge() {
            socket.emit("redeemPledge", this.tile.id)
        }
    },
    computed: {
        pledge() {
            return this.tile.pledge
        }
    },
    inject: ["closeOwn"]
}
</script>

<style scoped>
.info p {
    text-align: center;
}

.info_warning {
    color: brown;
    font-weight: bold;
}
</style>
