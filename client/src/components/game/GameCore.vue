<template>
    <div class="game">
        <FieldMain>
            <PlayerTableMain></PlayerTableMain>
            <WorkspaceMain></WorkspaceMain>
        </FieldMain>
        <PanelMain></PanelMain>
        <ConsoleDev v-show="showConsole"></ConsoleDev>
        <StatusConnection></StatusConnection>
    </div>
</template>

<script>
import FieldMain from "./Field/FieldMain.vue";
import PanelMain from "./Panel/PanelMain.vue";
import WorkspaceMain from "./Workspace/WorkspaceMain.vue";
import PlayerTableMain from "./PlayerTable/PlayerTableMain.vue"
import ConsoleDev from "../devComponents/ConsoleDev.vue";
import StatusConnection from "../devComponents/StatusConnection.vue";

export default {
    name: "GameCore",
    components: {
        FieldMain,
        PanelMain,
        WorkspaceMain,
        PlayerTableMain,
        ConsoleDev,
        StatusConnection
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
