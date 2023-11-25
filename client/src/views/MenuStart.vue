<template>
    <WindowComponent>
        <RouterLink to="/create"><ButtonMain title="Create room"></ButtonMain></RouterLink>
        <RouterLink to="/list"><ButtonMain title="List rooms"></ButtonMain></RouterLink>
    </WindowComponent>
</template>

<script>
import WindowComponent from '../components/common/WindowComponent.vue';
import ButtonMain from '../components/common/ButtonMain.vue';

import { skipCreate } from "@/components/devComponents/skip"

export default {
    name: "MenuStart",
    components: {
        WindowComponent,
        ButtonMain
    },

    mounted() {
        skipCreate(this.$router)
    }
}
</script>

<style scoped>

</style>
