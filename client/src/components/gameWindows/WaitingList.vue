<template>
    <WindowComponent>
        <ListComponent :elements="list">
        </ListComponent>

        <ButtonMain title="Start game" @click="console.log('Start game')" v-show="activeButton"></ButtonMain>
    </WindowComponent>
</template>

<script>
import WindowComponent from '../common/WindowComponent.vue';
import ButtonMain from '../common/ButtonMain.vue';
import ListComponent from '../common/ListComponent.vue';
import { state } from "@/socket"

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
    }
}
</script>
