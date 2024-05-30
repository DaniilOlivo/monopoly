<template>
    <WindowComponent :fullscreen="true">
        <h1>
           Победил
           <span class="winner" :style="{color: winner.color.primary}">
                {{ winner.username }}
            </span> 
        </h1>

        <p>Поздравляем! Вы победили! Вы разорили всех игроков и оказались самым главным монополистом мудаком</p>

        <template v-slot:btns>
            <RouterLink to="/">
                <ButtonMain>Главное меню</ButtonMain>
            </RouterLink>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue'
import ButtonMain from '@/components/common/ButtonMain.vue'

import { mapState } from "vuex"

export default {
    name: "EndWindow",
    components: {
        WindowComponent,
        ButtonMain
    },

    computed: mapState({
        winner: (state) => state.game.winner
    })
}
</script>
