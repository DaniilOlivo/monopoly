<template>
    <WindowComponent title="Lobby">
        <ListComponent :elements="list">
        </ListComponent>

        <template v-slot:btns>
            <ButtonMain title="Leave" @click="clickLeave"></ButtonMain>
            <ButtonMain title="Start game" @click="clickStartGame" v-show="activeButton"></ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '../common/WindowComponent.vue';
import ButtonMain from '../common/ButtonMain.vue';
import ListComponent from '../common/ListComponent.vue';
import { state, socket } from "@/socket"

import { skipStartGame } from "@/components/devComponents/skip"

export default {
    name: "WaitingList",
    components: {
        WindowComponent,
        ButtonMain,
        ListComponent,
    },
    computed: {
        list() {
            const objPlayers = state.messages.WaitingList
            if (!objPlayers) return []
            return Object.keys(objPlayers)
        },

        activeButton() {
            const objPlayers = state.messages.WaitingList

            if (objPlayers) {
                const username = state.username
                const host = objPlayers[username].host
                const lenPlayers = Object.keys(objPlayers).length
                
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
