<template>
    <WindowComponent :fullscreen="true" title="Придумайте имя">
        <div class="input-line">
            <label>Имя игрока:</label>
            <input type="text" v-model="username">
        </div>
        <p class="warning" v-show="warning">{{ warning }}</p>

        <template v-slot:btns>
            <ButtonMain @click="clickRegister">Присоединится</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue'
import ButtonMain from '../common/ButtonMain.vue'
import { socket } from "@/socket"

export default {
    name: "PlayerRegister",
    components: {
        WindowComponent,
        ButtonMain
    },

    data() {
        return {
            username: "",
        }
    },

    computed: {
        warning() {
            return this.$store.state.service.register
        }
    },

    methods: {
        clickRegister() {
            const room = this.$router.currentRoute.value.params.room
            socket.emit("register", this.username, room)
        }
    }
}

</script>
