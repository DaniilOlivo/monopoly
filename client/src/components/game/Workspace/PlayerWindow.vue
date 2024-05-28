<template>
    <WindowComponent title="Player card">
        <p>
            Cards jailbreaks: {{ thisPlayer.releasePrison }}
        </p>

        <template v-slot:btns>
            <ButtonMain @click="clickClose">Close</ButtonMain>
            <ButtonMain @click="clickGiveUp">Give up</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';

import { mapGetters, mapMutations } from 'vuex';

export default {
    name: "PlayerWindow",
    components: {
        WindowComponent,
        ButtonMain
    },
    computed: {
        ...mapGetters(["thisPlayer"]),
    },
    methods: {
        ...mapMutations("workspace", ["showDialog", "closeDialog"]),

        clickClose() {
            this.closeDialog()
        },

        clickGiveUp() {
            this.showDialog("SurrenderWindow")
        }
    }
}
</script>
