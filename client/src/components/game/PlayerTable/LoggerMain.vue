<template>
    <div class="list-log" ref="listLog">
        <LogLine
            v-for="line in listLogs"
            v-bind="line"
            :key="line.id"></LogLine>
    </div>

    <div class="log-input">
        <input type="text" class="log-input__input" v-model="mes" @keyup.enter="sendMes">
        <ButtonMain @click="sendMes" :disable="!mes">{{ $t("game.playerTable.message") }}</ButtonMain>
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
            
            const arrLines = []

            for (let objLog of logs) {
                const logLine = Object.assign(objLog)
                let color = "white"
                if (logLine.sender in players) color = players[logLine.sender].color.primary
                if (logLine.type === "error") {
                    color = "darkred"
                    logLine.fillAllColor = true
                }
                logLine.color = color

                if (logLine.type == "event") logLine.mes = this.$t("game.mes." + logLine.mes)

                arrLines.push(logLine)
            }

            return arrLines
        }
    },
    methods: {
        sendMes() {
            gameApi("message", {message: this.mes})
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
