<template>
    <div class="console-dev">
        <div class="console-log">
            <p 
                class="console-log__line"
                v-for="(line, index) in logs"
                :key="index">{{ line }}</p>
        </div>

        <input
            type="text"
            v-model="currentCommand"
            class="console-dev__input"
            @keyup.enter="executeCommand">
    </div>
</template>

<script>
import { gameApi } from "@/socket"

export default {
    name: "ConsoleDev",
    data() {
        return {
            currentCommand: "",
            logs: []
        }
    },
    methods: {
        executeCommand() {
            const command = this.currentCommand
            if (this.currentCommand == "") return
            if (command == "exit") return this.$store.commit("setConsole", false)
            this.logs.push(command)
            gameApi("command", command)
            this.currentCommand = ""
        }
    }
}
</script>

<style scoped>
    .console-dev {
        position: fixed;
        bottom: 50px;
        right: 0;

        z-index: 100;
        color: white;

        width: 350px;
    }
    .console-log {
        background-color: rgba(20, 20, 20, 0.7);
        padding: 10px 20px;
        margin-bottom: 15px;
        height: 200px;
        overflow-y: auto;
    }

    .console-dev__input {
        background-color: rgba(20, 20, 20, 0.7);
        padding: 5px 10px;
        border-radius: 0;
        border: none;
        color: white;
        width: 100%;
    }
</style>
