<template>
    <div :class="['workspace', {'workspace_active': offerPurchase || cardHover}]">
        <BuyWindow v-if="offerPurchase" :tile="offerPurchase"></BuyWindow>

        <WindowComponent :modal="false" v-else-if="cardHover">
            <CardDispather :tile="cardHover"></CardDispather>
        </WindowComponent>
    </div>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import CardDispather from './cards/CardDispather.vue';
import BuyWindow from './workspace/BuyWindow.vue';

import { state } from "@/socket"

export default {
    name: "FieldWorkspace",
    components: {
        WindowComponent,
        CardDispather,
        BuyWindow
    },
    props: ["cardHover"],

    computed: {
        offerPurchase() {
            const {username, game} = state
            return game.players[username].service.offer
        }
    }
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
