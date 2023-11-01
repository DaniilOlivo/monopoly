<template>
    <WindowComponent>
        <ul class="list">
            <li class="list__el" v-for="title in list" :key="title">
                {{ title }}
            </li>
        </ul>

        <ButtonMain title="Обновить" @click="updateList"></ButtonMain>
    </WindowComponent>
    
</template>

<script>
import WindowComponent from '../components/common/WindowComponent.vue';
import ButtonMain from '../components/common/ButtonMain.vue';

export default {
    name: "ListRooms",
    components: {
        WindowComponent,
        ButtonMain
    },
    data() {
        return {
            list: [],
        }
    },
    created() {
        this.updateList()
    },
    inject: ["getListRooms"],
    methods: {
        async updateList() {
            const list = await this.getListRooms()
            this.list = list
        },

        selectRoom(title) {
            this.$router.push({
                name: "game",
                params: {room: title}
            })
        }
    }
}
</script>

<style scoped>
    .list {
        list-style-type: none;
        padding: 0px;
        position: relative;
    }

    .list::before {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10;
        box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
        pointer-events: none;
    }

    .list__el {
        cursor: pointer;
        padding: 0.8em 3em;
        transition: 200ms;
    }

    .list__el:nth-child(odd) {
        background-color: whitesmoke;
    }

    .list__el:hover {
        background-color: brown;
    } 
</style>
