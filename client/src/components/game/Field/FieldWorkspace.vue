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

import { mapState } from "vuex"

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
        ...mapState([
            "username",
            "game",
        ]),

        ...mapState("deal", {activeDeal: state => state.localObjectDeal.active}),

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
            return this.game.players[this.username].service.offer
        },
        activeOwn() {
            if (!this.selectOwn) return null
            const own = this.game.players[this.username].own
            if (own.indexOf(this.selectOwn.id) != -1) return this.selectOwn
            else return null
        },
        rentWait() {
            return this.game.players[this.username].service.rent
        },
        taxWait() {
            return this.game.players[this.username].service.pay
        },
        objDeal() {
            console.log(this.activeDeal)
            return this.activeDeal
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
