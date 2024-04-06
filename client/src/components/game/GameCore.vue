<template>
    <div class="game">
        <FieldMain></FieldMain>
        <MainPanel></MainPanel>
        <ConsoleDev v-show="showConsole"></ConsoleDev>
    </div>
</template>

<script>
import FieldMain from "./Field/FieldMain.vue";
import MainPanel from "./Panel/MainPanel.vue";
import ConsoleDev from "../devComponents/ConsoleDev.vue";

export default {
    name: "GameCore",
    components: {
        FieldMain,
        MainPanel,
        ConsoleDev
    },
    computed: {
        showConsole() {
            return this.$store.state.consoleDevOpen;
        }
    }
}
</script>

<style scoped>
.game {
    display: flex;
}
</style>
