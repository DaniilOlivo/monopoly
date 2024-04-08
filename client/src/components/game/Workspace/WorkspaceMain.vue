<template>
    <div :class="['workspace', {'workspace_active': currentWindow}]">
        <component :is="currentWindow"></component>
    </div>
</template>

<script>
import BuyWindow from "./BuyWindow.vue"
import HoverWindow from './HoverWindow.vue';
import OwnWindow from './OwnWindow.vue';
import RentWindow from './RentWindow.vue';
import DealWindow from './DealWindow.vue';
import TaxWindow from './TaxWindow.vue';

import { mapGetters } from "vuex"

export default {
    name: "WorkspaceMain",
    components: {
        BuyWindow,
        HoverWindow,
        OwnWindow,
        RentWindow,
        DealWindow,
        TaxWindow
    },
    computed: {
        ...mapGetters(["thisPlayer"]),

        ...mapGetters("deal", ["activeDeal"]),

        ...mapGetters("workspace", [
            "selectOwn",
            "cardHover",
        ]),

        currentWindow() {
            const listWindows = [
                ["OwnWindow", this.selectThisPlayerOwn],
                ["BuyWindow", this.thisPlayer.service.offer],
                ["RentWindow", this.thisPlayer.service.rent],
                ["TaxWindow", this.thisPlayer.service.tax],
                ["DealWindow", this.activeDeal],
                ["HoverWindow", this.cardHover],
            ]

            for (const [titleWindow, active] of listWindows) {
                if (active) return titleWindow
            }

            return null
        },

        selectThisPlayerOwn() {
            console.log(this.selectOwn)
            const tile = this.selectOwn
            if (!tile) return null
            const ownList = this.thisPlayer.own
            if (ownList.includes(tile.id)) return tile
            return null
        }
    }
}
</script>

<style>
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
