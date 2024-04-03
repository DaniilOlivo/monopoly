<template>
    <WindowComponent title="Tax">
        <p>
            Pay tax in the amount
            <span class="tax-window__cost">{{ cost }}</span>
        </p>

        <template v-slot:btns>
            <ButtonMain @click="clickPay" :disable="disableBtn">Pay</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';

import { mapState } from 'vuex';
import { gameApi } from "@/socket"

export default {
    name: 'TaxWindow',
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
            const player = this.game.players[this.username]
            return player.service.pay
        },

        disableBtn() {
            const player = this.game.players[this.username]
            return this.cost > player.money
        }
    },
    methods: {
        clickPay() {
            gameApi("tax")
        }
    }
}

</script>

<style scoped>
.tax-window__cost {
    font-style: italic;
}
</style>
