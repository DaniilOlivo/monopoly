<template>
    <div class="game">
        <FieldMain></FieldMain>
        <MainPanel></MainPanel>
    </div>
</template>

<script>
import FieldMain from "./Field/FieldMain.vue";
import MainPanel from "./Panel/MainPanel.vue";

export default {
    name: "GameCore",
    components: {
        FieldMain,
        MainPanel
    }
}
</script>

<style scoped>
.game {
    display: flex;
}
</style>
