<template>
    <WindowComponent>
        <div class="input-line">
            <label>Title room:</label>
            <input type="text" v-model="title">
        </div>
        <p class="warning" v-show="warning">{{ warning }}</p>
        <ButtonMain title="Create room" @click="clickCreate(title)"></ButtonMain>

    </WindowComponent>
</template>

<script>
import WindowComponent from '../components/common/WindowComponent.vue';
import ButtonMain from '../components/common/ButtonMain.vue';

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
    inject: ["createRoom"],
    methods: {
        async clickCreate(title) {
            const {ok, desc} = await this.createRoom(title)
            if (ok) {
                this.$router.push({
                    name: "game",
                    params: {room: title}
                })
            }
            else this.warning = desc
        }
    }
}
</script>
