<template>
    <WindowComponent :fullscreen="true" :title="$t('playerRegister.title')">
        <div class="input-line">
            <label>{{ $t('playerRegister.label') }}:</label>
            <input type="text" v-model="username">
        </div>
        <p class="warning" v-show="warning">{{ $t("playerRegister.warnings." + warning) }}</p>

        <template v-slot:btns>
            <ButtonMain @click="clickRegister">{{ $t("playerRegister.join") }}</ButtonMain>
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
            socket.emit("entryLobby", room, this.username)
        }
    }
}

</script>
