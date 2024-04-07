<template>
    <div class="game">
        <FieldMain></FieldMain>
        <PanelMain></PanelMain>
        <ConsoleDev v-show="showConsole"></ConsoleDev>
    </div>
</template>

<script>
import FieldMain from "./Field/FieldMain.vue";
import PanelMain from "./Panel/PanelMain.vue";
import ConsoleDev from "../devComponents/ConsoleDev.vue";

export default {
    name: "GameCore",
    components: {
        FieldMain,
        PanelMain,
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
