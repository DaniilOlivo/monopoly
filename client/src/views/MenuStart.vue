<template>
    <WindowComponent :fullscreen="true">
        <RouterLink to="/create"><ButtonMain>{{ $t("menuStart.create") }}</ButtonMain></RouterLink>
        <RouterLink to="/list"><ButtonMain>{{ $t("menuStart.list") }}</ButtonMain></RouterLink>
    </WindowComponent>

    <AsidePanel></AsidePanel>
</template>

<script>
import WindowComponent from '../components/common/WindowComponent.vue';
import ButtonMain from '../components/common/ButtonMain.vue';
import AsidePanel from '@/components/other/AsidePanel.vue';

export default {
    name: "MenuStart",
    components: {
        WindowComponent,
        ButtonMain,
        AsidePanel
    }
}
</script>
