<template>
    <WindowComponent :fullscreen="true" title="Lobby">
        <ListComponent :elements="list">
        </ListComponent>

        <template v-slot:btns>
            <ButtonMain @click="clickLeave">Leave</ButtonMain>
            <ButtonMain @click="clickStartGame" :disable="!activeButton">Start game</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '../common/WindowComponent.vue';
import ButtonMain from '../common/ButtonMain.vue';
import ListComponent from '../common/ListComponent.vue';

import { socket } from "@/socket"
import { mapState } from "vuex"

import { skipStartGame } from "@/components/devComponents/skip"

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
            return Object.keys(this.objectPlayers)
        },

        activeButton() {
            if (this.objectPlayers) {
                const host = this.objectPlayers[this.username].host
                const lenPlayers = this.list.length
                
                return host && lenPlayers >= 2
            }
            
            return false
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
    },

    watch: {
        list(value) {
            skipStartGame(value)
        }
    }
}
</script>
