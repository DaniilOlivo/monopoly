<template>
    <WindowComponent title="Вы действительно хотите сдаться?">
        <template v-slot:btns>
            <ButtonMain @click="clickCancel">Отмена</ButtonMain>
            <ButtonMain @click="clickGiveUp">Сдаться</ButtonMain>
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
        ...mapMutations("workspace", ["showDialog", "closeDialog"]),

        clickCancel() {
            this.showDialog("PlayerWindow")
        },

        clickGiveUp() {
            gameApi("surrender")
            this.closeDialog()
        }
    }
}
</script>