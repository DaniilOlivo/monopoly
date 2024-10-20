<template>
    <div class="game">
        <FieldMain>
            <PlayerTableMain></PlayerTableMain>
            <WorkspaceMain></WorkspaceMain>
        </FieldMain>
        <PanelMain></PanelMain>
    </div>
</template>

<script>
import FieldMain from "./Field/FieldMain.vue";
import PanelMain from "./Panel/PanelMain.vue";
import WorkspaceMain from "./Workspace/WorkspaceMain.vue";
import PlayerTableMain from "./PlayerTable/PlayerTableMain.vue"

export default {
    name: "GameCore",
    components: {
        FieldMain,
        PanelMain,
        WorkspaceMain,
        PlayerTableMain,
    }
}
</script>

<style scoped>
.game {
    display: flex;
}
</style>
