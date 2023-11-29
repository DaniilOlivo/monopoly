<template>
    <div class="container-game-panel">
        <div class="game-panel">
            <PanelRoller></PanelRoller>
        </div>
    </div>
    
</template>

<script>
import PanelRoller from './PanelRoller.vue';

export default {
    name: "MainPanel",
    components: {
        PanelRoller
    }
}
</script>

<style scoped>
.container-game-panel {
    flex-grow: 1;

    position: relative;
}

.game-panel {
    display: flex;
    flex-direction: column;
    gap: 40px;

    position: sticky;
    top: 0;
    left: 0;
}
</style>
