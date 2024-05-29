<template>
    <WindowComponent :fullscreen="true">
        <RouterLink to="/create"><ButtonMain>Create room</ButtonMain></RouterLink>
        <RouterLink to="/list"><ButtonMain>List rooms</ButtonMain></RouterLink>
    </WindowComponent>
</template>

<script>
import WindowComponent from '../components/common/WindowComponent.vue';
import ButtonMain from '../components/common/ButtonMain.vue';

export default {
    name: "MenuStart",
    components: {
        WindowComponent,
        ButtonMain
    }
}
</script>

<style scoped>

</style>
