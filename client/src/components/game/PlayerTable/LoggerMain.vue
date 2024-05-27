<template>
    <div class="list-log" ref="listLog">
        <LogLine
            v-for="line in listLogs"
            v-bind="line"
            :key="line.id"></LogLine>
    </div>

    <div class="log-input">
        <input type="text" class="log-input__input" v-model="mes" @keyup.enter="sendMes">
        <ButtonMain @click="sendMes" :disable="!mes">Message</ButtonMain>
    </div>
</template>

<script>
import LogLine from "./LineLogger.vue"
import ButtonMain from "@/components/common/ButtonMain.vue"

import { gameApi } from "@/socket"

export default {
    name: "LoggerMain",
    components: {
        LogLine,
        ButtonMain
    },
    data() {
        return {
            mes: ""
        }
    },
    computed: {
        listLogs() {
            const game = this.$store.state.game
            const {logs, players} = game
            
            let count = 0
            logs.forEach((objLog) => {
                objLog.id = count
                let color = "white"
                const sender = objLog.sender
                if (sender in players) color = players[sender].color.primary
                if (sender === "system") color = "darkblue"
                if (sender === "error") color = "red"
                objLog.color = color
                objLog.flagError = sender === "error"
                count++
            })

            return logs
        }
    },
    methods: {
        sendMes() {
            if (this.mes == "console_active") this.$store.commit("setConsole", true)
            else gameApi("message", {message: this.mes})
            this.mes = ""
        },

        scrollToBottom() {
            const el = this.$refs.listLog
            if (el) el.scrollTop = el.scrollHeight ** 2
        }
    },

    updated() {
        this.scrollToBottom()
    }
}
</script>

<style scoped>
.list-log {
    grid-row: 1;
    grid-column: 1;

    display: flex;
    flex-direction: column;
    gap: 0.5em;
    background-color: rgba(50, 50, 50, 0.95);
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 15px;
    flex-grow: 1;
    border-radius: 15px 0 0 15px;
}

.list-log::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #434343;
}

.list-log::-webkit-scrollbar
{
  width: 8px;
  background-color: #434343;
}

.list-log::-webkit-scrollbar-thumb
{
  background-color: rgb(114, 32, 32);
}

.log-input {
    grid-row: 2;
    grid-column: 1;

    display: flex;
    gap: 10px;
    padding: 10px 20px;
}

.log-input__input {
    flex-grow: 1;
    padding: 0.5em 1.5em;
}
</style>
