<template>
    <WindowComponent :title="$t('game.player.title')">
        <p>
            {{ $t("game.player.jailbreak") }}: {{ thisPlayer.releasePrison }}
        </p>

        <template v-slot:btns>
            <ButtonMain @click="clickClose">
                {{ $t("game.player.close") }}
            </ButtonMain>
            <ButtonMain @click="clickGiveUp">
                {{ $t("game.player.giveUp") }}
            </ButtonMain>
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
