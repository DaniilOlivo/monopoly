<template>
    <div class="player-table">
        <div class="player-table-container">
            <LoggerMain></LoggerMain>
            <PlayerMemo></PlayerMemo>
        </div>
    </div>
</template>

<script>
import LoggerMain from "./LoggerMain.vue"
import PlayerMemo from "./PlayerMemo.vue";

export default {
    name: "PlayerTableMain",
    components: {
        LoggerMain,
        PlayerMemo,
    }
}
</script>

<style scoped>
.player-table {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 20;
}

.player-table-container {
    height: 70%;
    width: 70%;

    display: grid;
    grid-template-columns: 70% 30%;
    grid-template-rows: 1fr auto;
}
</style>
