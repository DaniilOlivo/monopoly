<template>
    <WindowComponent :fullscreen="true">
        <h1>
           {{ $t("game.end.label") }}
           <span class="winner" :style="{color: winner.color.primary}">
                {{ winner.username }}
            </span> 
        </h1>

        <p>{{ $t("game.end.desc") }}</p>

        <template v-slot:btns>
            <ButtonMain @click="clickLeave">{{ $t("buttons.mainMenu") }}</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue'
import ButtonMain from '@/components/common/ButtonMain.vue'

import { mapState } from "vuex"
import { leave } from '@/socket';

export default {
    name: "EndWindow",
    components: {
        WindowComponent,
        ButtonMain
    },

    computed: mapState({
        winner: (state) => state.game.winner
    }),

    methods: {
        clickLeave() {
            leave({noUpdate: true})
            this.$router.push("/")
        }
    }
}
</script>
