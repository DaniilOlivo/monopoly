<template>
    <WindowComponent :fullscreen="true">
        <RouterLink to="/create"><ButtonMain>Создать комнату</ButtonMain></RouterLink>
        <RouterLink to="/list"><ButtonMain>Список комнат</ButtonMain></RouterLink>
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
