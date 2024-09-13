<template>
    <WindowComponent :fullscreen="true" title="Create Room">
        <div class="input-line">
            <label>Title room:</label>
            <input type="text" v-model="title">
        </div>
        <p class="warning" v-show="warning">{{ warning }}</p>

        <template v-slot:btns>
            <ButtonMain @click="clickBack">Back</ButtonMain>
            <ButtonMain @click="clickCreate">Create room</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '../components/common/WindowComponent.vue';
import ButtonMain from '../components/common/ButtonMain.vue';

import { socket } from '@/socket';
import { mapState, mapMutations } from 'vuex';

export default {
    name: "CreateRoom",
    components: {
        WindowComponent,
        ButtonMain,
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
            if (this.title) socket.emit("createRoom", this.title)
            else this.setService({service: "create", value: "Empty title"})
        },

        clickBack() {
            this.$router.push("/")
        }
    }
}
</script>
