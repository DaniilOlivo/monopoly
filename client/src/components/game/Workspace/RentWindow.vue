<template>
    <WindowComponent title="Rent">
        <p>
            You have to pay <span class="rent-window__cost">{{ rent.cost }} М.</span>
            player <span
                class="rent-window__owner"
                :style="{color: colorOwner}">{{ rent.tile.owner }}</span>
        </p>

        <template v-slot:btns>
            <ButtonMain @click="clickRent" :disable="disableRent">Rent</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';

import { mapState, mapGetters } from 'vuex';
import { gameApi } from "@/socket";

export default {
    name: "RentWindow",
    components: {
        WindowComponent,
        ButtonMain
    },
    computed: {
        ...mapState(["game"]),

        ...mapGetters(["thisPlayer"]),

        rent() {
            return this.thisPlayer.service.rent
        },

        colorOwner() {
            const owner = this.rent.tile.owner
            return this.game.players[owner].color.secondary
        },

        disableRent() {
            return this.rent.cost > this.thisPlayer.money
        }
    },
    methods: {
        clickRent() {
            gameApi("rent", {next: true})
        }
    }
}
</script>

<style scoped>
.rent-window__cost {
    font-style: italic;
}

.rent-window__owner {
    font-weight: bold;
}
</style>
