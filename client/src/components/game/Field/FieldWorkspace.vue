<template>
    <div :class="['workspace', {'workspace_active': activeWorkspace}]">
        <OwnWindow v-if="activeOwn" :tile="activeOwn"></OwnWindow>
        <BuyWindow v-else-if="offerPurchase" :tile="offerPurchase"></BuyWindow>
        <RentWindow v-else-if="rentWait"></RentWindow>
        <TaxWindow v-else-if="taxWait"></TaxWindow>
        <DealWindow v-else-if="objDeal"></DealWindow>
        <HoverWindow v-else-if="cardHover" :tile="cardHover"></HoverWindow>
    </div>
</template>

<script>
import BuyWindow from './workspace/BuyWindow.vue';
import HoverWindow from './workspace/HoverWindow.vue';
import OwnWindow from './workspace/OwnWindow.vue';
import RentWindow from './workspace/RentWindow.vue';
import DealWindow from './workspace/DealWindow.vue';
import TaxWindow from './workspace/TaxWindow.vue';

import { state } from "@/socket"
import { store } from "@/store"

export default {
    name: "FieldWorkspace",
    components: {
        BuyWindow,
        HoverWindow,
        OwnWindow,
        RentWindow,
        DealWindow,
        TaxWindow
    },
    props: ["cardHover", "selectOwn"],
    computed: {
        activeWorkspace() {
            const arrTriggers = [
                this.offerPurchase,
                this.activeOwn,
                this.rentWait,
                this.taxWait,
                this.cardHover,
                this.objDeal
            ]

            return arrTriggers.some(trigger => trigger)
        },
        offerPurchase() {
            const {username, game} = state
            return game.players[username].service.offer
        },
        activeOwn() {
            if (!this.selectOwn) return null
            const {username, game} = state
            const own = game.players[username].own
            if (own.indexOf(this.selectOwn.id) != -1) return this.selectOwn
            else return null
        },
        rentWait() {
            const {username, game} = state
            return game.players[username].service.rent
        },
        taxWait() {
            const {username, game} = state
            return game.players[username].service.pay
        },
        objDeal() {
            return store.state.objDeal
        }
    },
    emits: ["closeOwn"]
}
</script>

<style scoped>
.workspace {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: none;
    justify-content: center;
    align-items: center;

    transition: 200ms;
}

.workspace_active {
    display: flex;
    background-color: rgba(30, 30, 30, 0.5);
}
</style>
