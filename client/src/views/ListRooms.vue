<template>
    <WindowComponent title="List room">
        <ListComponent :elements="list" :clickable="true">
        </ListComponent>

        <template v-slot:btns>
            <ButtonMain title="Back" @click="clickBack"></ButtonMain>
            <ButtonMain title="Update" @click="updateList"></ButtonMain>
        </template>
    </WindowComponent>
    
</template>

<script>
import WindowComponent from '../components/common/WindowComponent.vue';
import ButtonMain from '../components/common/ButtonMain.vue';
import ListComponent from '@/components/common/ListComponent.vue';

export default {
    name: "ListRooms",
    components: {
        WindowComponent,
        ButtonMain,
        ListComponent
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
            this.list = list.map(title => {
                return {
                    title,
                    click: () => this.selectRoom(title)
                }
            })
        },

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
