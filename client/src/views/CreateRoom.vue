<template>
    <WindowComponent :fullscreen="true" title="Создание комнаты">
        <div class="input-line">
            <label>Название комнаты:</label>
            <input type="text" v-model="title">
        </div>
        <p class="warning" v-show="warning">{{ warning }}</p>

        <template v-slot:btns>
            <ButtonMain @click="clickBack">Назад</ButtonMain>
            <ButtonMain @click="clickCreate(title)">Создать комнату</ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '../components/common/WindowComponent.vue';
import ButtonMain from '../components/common/ButtonMain.vue';

import { createRoom } from "@/api/menu"

export default {
    name: "CreateRoom",
    components: {
        WindowComponent,
        ButtonMain,
    },
    data() {
        return {
            title: "",
            warning: "",
        }
    },
    methods: {
        async clickCreate(title) {
            const {ok, desc} = await createRoom(title)
            if (ok) {
                this.$router.push({
                    name: "game",
                    params: {room: title}
                })
            }
            else this.warning = desc
        },

        clickBack() {
            this.$router.push("/")
        }
    }
}
</script>
