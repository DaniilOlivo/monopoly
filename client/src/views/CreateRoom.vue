<template>
    <WindowComponent :fullscreen="true" :title="$t('createRoom.title')">
        <div class="input-line">
            <label>{{ $t("createRoom.label") }}:</label>
            <input type="text" v-model="title">
        </div>
        <p class="warning" v-if="warning">{{ $t("createRoom.warnings." + warning) }}</p>

        <template v-slot:btns>
            <ButtonMain @click="clickBack">{{ $t("buttons.back") }}</ButtonMain>
            <ButtonMain @click="clickCreate" :disable="!title">{{ $t("createRoom.title") }}</ButtonMain>
        </template>
    </WindowComponent>

    <AsidePanel></AsidePanel>
</template>

<script>
import WindowComponent from '../components/common/WindowComponent.vue';
import ButtonMain from '../components/common/ButtonMain.vue';
import AsidePanel from '@/components/other/AsidePanel.vue';

import { socket } from '@/socket';
import { mapState, mapMutations } from 'vuex';

export default {
    name: "CreateRoom",
    components: {
        WindowComponent,
        ButtonMain,
        AsidePanel
    },
    data() {
        return {
            title: ""
        }
    },
    unmounted() {
        this.setService({service: "create", value: ""})
    },
    computed: mapState({
        warning: state => state.service.create
    }),
    methods: {
        ...mapMutations(["setService"]),

        clickCreate() {
            socket.emit("createRoom", this.title)
        },

        clickBack() {
            this.$router.push("/")
        }
    }
}
</script>
