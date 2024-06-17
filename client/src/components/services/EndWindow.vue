<template>
    <WindowComponent :fullscreen="true">
        <h1>
           Win
           <span class="winner" :style="{color: winner.color.primary}">
                {{ winner.username }}
            </span> 
        </h1>

        <p>Congratulations! You won! They ruined all the players and turned out to be the most important asshole monopolist</p>

        <template v-slot:btns>
            <ButtonMain @click="clickLeave">Main Menu</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue'
import ButtonMain from '@/components/common/ButtonMain.vue'

import { socket } from "@/socket"
import { mapState } from "vuex"

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
            socket.disconnect()
            this.$router.push("/")
        }
    }
}
</script>
