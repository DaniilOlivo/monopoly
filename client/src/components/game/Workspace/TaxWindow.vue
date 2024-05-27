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

import { mapGetters } from 'vuex';
import { gameApi } from "@/socket"

export default {
    name: 'TaxWindow',
    components: {
        WindowComponent,
        ButtonMain
    },
    computed: {
        ...mapGetters(["thisPlayer"]),

        cost() {
            return this.thisPlayer.service.tax
        },

        disableBtn() {
            return this.cost > this.thisPlayer.money
        }
    },
    methods: {
        clickPay() {
            gameApi("tax", {next: true})
        }
    }
}

</script>

<style scoped>
.tax-window__cost {
    font-style: italic;
}
</style>
