<template>
    <WindowComponent :fullscreen="true" :title="$t('waitingList.title')">
        <ListComponent :elements="list">
        </ListComponent>

        <p v-if="isPlayerHost && !activeButton">{{ $t("waitingList.minimum") }}</p>
        <p v-if="!isPlayerHost">{{ $t("waitingList.onlyHost") }}</p>

        <template v-slot:btns>
            <ButtonMain @click="clickLeave">{{ $t("buttons.leave") }}</ButtonMain>
            <ButtonMain
                v-if="isPlayerHost"
                @click="clickStartGame"
                :disable="!activeButton">{{ $t("waitingList.startGame") }}</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '../common/WindowComponent.vue';
import ButtonMain from '../common/ButtonMain.vue';
import ListComponent from '../common/ListComponent.vue';

import { socket, leave } from "@/socket"
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
            leave()
            this.$router.push("/")
        },

        clickStartGame() {
            socket.emit("startGame")
        },
    }
}
</script>
