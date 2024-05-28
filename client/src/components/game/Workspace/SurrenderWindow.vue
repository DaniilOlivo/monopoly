<template>
    <WindowComponent title="Do you really want to give up?">
        <template v-slot:btns>
            <ButtonMain @click="clickCancel">Cancel</ButtonMain>
            <ButtonMain @click="clickGiveUp">Give Up</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';

import { gameApi } from '@/socket';
import { mapMutations } from 'vuex';

export default {
    name: "SurrenderWindow",
    components: {
        WindowComponent,
        ButtonMain
    },
    methods: {
        ...mapMutations("workspace", ["closeDialog"]),

        clickCancel() {
            this.closeDialog()
        },

        clickGiveUp() {
            gameApi("surrender")
            this.closeDialog()
        }
    }
}
</script>