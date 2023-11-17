<template>
    <WindowComponent>
        <div class="input-line">
            <label>Username:</label>
            <input type="text" v-model="username">
        </div>
        <p class="warning" v-show="warning">{{ warning }}</p>
        <ButtonMain title="Join room" @click="clickRegister()"></ButtonMain>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue'
import ButtonMain from '../common/ButtonMain.vue'
import { state, socket } from "@/socket"

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
            return state.messages.PlayerRegister
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
