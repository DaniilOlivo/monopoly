<template>
    <WindowComponent :modal="false">
        <p>
            Pay tax in the amount
            <span class="tax-window__cost">{{ cost }}</span>
        </p>

        <template v-slot:btns>
            <ButtonMain title="Pay" @click="clickPay" :disable="disableBtn"></ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';
import { socket, state } from "@/socket"

export default {
    name: 'TaxWindow',
    components: {
        WindowComponent,
        ButtonMain
    },
    computed: {
        cost() {
            const { username, game } = state
            const player = game.players[username]
            return player.service.pay
        },

        disableBtn() {
            const { username, game } = state
            const player = game.players[username]
            return this.cost > player.money
        }
    },
    methods: {
        clickPay() {
            socket.emit('pay')
        }
    }
}

</script>

<style scoped>
.tax-window__cost {
    font-style: italic;
}
</style>
