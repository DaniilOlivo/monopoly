<template>
    <div :class="['workspace', {'workspace_active': activeWorkspace}]">
        <BuyWindow v-if="offerPurchase" :tile="offerPurchase"></BuyWindow>
        <OwnWindow v-else-if="activeOwn" :tile="activeOwn"></OwnWindow>
        <HoverWindow v-else-if="cardHover" :tile="cardHover"></HoverWindow>
    </div>
</template>

<script>
import BuyWindow from './workspace/BuyWindow.vue';
import HoverWindow from './workspace/HoverWindow.vue';
import OwnWindow from './workspace/OwnWindow.vue';

import { state } from "@/socket"

export default {
    name: "FieldWorkspace",
    components: {
        BuyWindow,
        HoverWindow,
        OwnWindow
    },
    props: ["cardHover", "selectOwn"],
    computed: {
        activeWorkspace() {
            return this.offerPurchase || this.activeOwn || this.cardHover
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
