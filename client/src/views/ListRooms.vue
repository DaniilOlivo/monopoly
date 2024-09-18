<template>
    <WindowComponent :fullscreen="true" :title="$t('listRooms.title')">
        <ListComponent :elements="list" :clickable="true">
        </ListComponent>

        <template v-slot:btns>
            <ButtonMain @click="clickBack">{{ $t("buttons.back") }}</ButtonMain>
        </template>
    </WindowComponent>
    
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';
import ListComponent from '@/components/common/ListComponent.vue';

import { socket } from '@/socket';
import { mapState } from "vuex"

export default {
    name: "ListRooms",
    components: {
        WindowComponent,
        ButtonMain,
        ListComponent
    },
    created() {
        socket.emit("pingRooms")
    },
    unmounted() {
        socket.emit("pongRooms")
    },

    computed: {
        ...mapState(["listRooms"]),
        list() {
            return this.listRooms.map(objRoom => {
                return {
                    label: objRoom.title,
                    detail: objRoom.count + "/" + "8",
                    click: () => this.selectRoom(objRoom.title)
                }
            })
        }
    },

    methods: {
        selectRoom(title) {
            this.$router.push({
                name: "game",
                params: {room: title}
            })
        },

        clickBack() {
            this.$router.push("/")
        }
    }
}
</script>
