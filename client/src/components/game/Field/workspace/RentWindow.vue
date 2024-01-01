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
import { socket, state } from "@/socket";

export default {
    name: "RentWindow",
    components: {
        WindowComponent,
        ButtonMain
    },
    computed: {
        cost() {
            const { username, game } = state
            return game.players[username].service.rent.cost
        },

        tile() {
            const { username, game } = state
            return game.players[username].service.rent.tile
        },

        colorOwner() {
            const { game } = state
            const owner = this.tile.owner
            return game.players[owner].color
        },

        disableRent() {
            const { username, game } = state
            const cost = this.cost
            return cost > game.players[username].money
        }
    },
    methods: {
        clickRent() {
            socket.emit("rent")
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
