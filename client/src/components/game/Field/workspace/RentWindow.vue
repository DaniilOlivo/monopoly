<template>
    <WindowComponent :modal="false">
        <p>
            You have to pay <span class="rent-window__cost">{{ cost }} М.</span>
            player <span
                class="rent-window__owner"
                :style="{color: colorOwner}">{{ tile.owner }}</span>
        </p>

        <template v-slot:btns>
            <ButtonMain title="Rent" @click="clickRent" :disable="disableRent"></ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';

import { mapState } from 'vuex';
import { gameApi } from "@/socket";

export default {
    name: "RentWindow",
    components: {
        WindowComponent,
        ButtonMain
    },
    computed: {
        ...mapState([
            "username",
            "game"
        ]),

        cost() {
            return this.game.players[this.username].service.rent.cost
        },

        tile() {
            return this.game.players[this.username].service.rent.tile
        },

        colorOwner() {
            const owner = this.tile.owner
            return this.game.players[owner].color
        },

        disableRent() {
            const cost = this.cost
            return cost > this.game.players[this.username].money
        }
    },
    methods: {
        clickRent() {
            gameApi("rent")
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
