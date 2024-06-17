<template>
    <WindowComponent :fullscreen="true" title="Lobby">
        <ListComponent :elements="list">
        </ListComponent>

        <p v-if="isPlayerHost && !activeButton">A minimum of two players are required to start the game.</p>
        <p v-if="!isPlayerHost">We are waiting for the host of the room to start the game</p>

        <template v-slot:btns>
            <ButtonMain @click="clickLeave">Leave</ButtonMain>
            <ButtonMain
                v-if="isPlayerHost"
                @click="clickStartGame"
                :disable="!activeButton">Start game</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '../common/WindowComponent.vue';
import ButtonMain from '../common/ButtonMain.vue';
import ListComponent from '../common/ListComponent.vue';

import { socket } from "@/socket"
import { mapState } from "vuex"

export default {
    name: "WaitingList",
    components: {
        WindowComponent,
        ButtonMain,
        ListComponent,
    },
    computed: {
        ...mapState({
            objectPlayers: state => state.service.waiting,
            username: "username",
        }),

        list() {
            if (!this.objectPlayers) return []
            return Object.keys(this.objectPlayers).map(username => {
                return {label: username}
            })
        },

        isPlayerHost() {
            if (!this.objectPlayers) return false
            return this.objectPlayers[this.username].host
        },

        activeButton() {        
            return this.list.length >= 2
        }
    },

    methods: {
        clickLeave() {
            socket.disconnect()
            this.$router.push("/")
        },

        clickStartGame() {
            socket.emit("startGame")
        },
    }
}
</script>
