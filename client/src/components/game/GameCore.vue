<template>
    <div class="game">
        <FieldMain>
            <LoggerMain></LoggerMain>
            <WorkspaceMain></WorkspaceMain>
        </FieldMain>
        <PanelMain></PanelMain>
        <ConsoleDev v-show="showConsole"></ConsoleDev>
    </div>
</template>

<script>
import FieldMain from "./Field/FieldMain.vue";
import PanelMain from "./Panel/PanelMain.vue";
import WorkspaceMain from "./Workspace/WorkspaceMain.vue";
import LoggerMain from "./Logger/LoggerMain.vue";
import ConsoleDev from "../devComponents/ConsoleDev.vue";

export default {
    name: "GameCore",
    components: {
        FieldMain,
        PanelMain,
        WorkspaceMain,
        LoggerMain,
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
