<template>
    <WindowComponent title="Come up with username">
        <div class="input-line">
            <label>Username:</label>
            <input type="text" v-model="username">
        </div>
        <p class="warning" v-show="warning">{{ warning }}</p>

        <template v-slot:btns>
            <ButtonMain title="Join room" @click="clickRegister"></ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue'
import ButtonMain from '../common/ButtonMain.vue'
import { socket } from "@/socket"

import { skipRegister } from "@/components/devComponents/skip"

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
    },

    mounted() {
        skipRegister()
    }
}

</script>
