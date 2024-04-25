<template>
    <div class="log">
        <div class="list-log" ref="listLog">
            <LogLine
                v-for="line in listLogs"
                v-bind="line"
                :key="line.id"></LogLine>
        </div>

        <div class="log-input">
            <input type="text" class="log-input__input" v-model="mes" @keyup.enter="sendMes">
            <ButtonMain @click="sendMes">Message</ButtonMain>
        </div>
    </div>
</template>

<script>
import LogLine from "./LogLine.vue"
import ButtonMain from "@/components/common/ButtonMain.vue"

import { gameApi } from "@/socket"

export default {
    name: "PanelLog",
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
                let color = "black"
                const sender = objLog.sender
                if (sender in players) color = players[sender].color.secondary
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
            gameApi("message", this.mes)
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
    box-sizing: border-box;
    display: display;
    flex-direction: column;
    height: 25vh;
    box-shadow: 5px 5px 5px -5px rgba(34, 60, 80, 0.6) inset;
    gap: 1em;
    background-color: whitesmoke;
    overflow-y: scroll;
    padding: 15px;
}

.log-input {
    display: flex;
    gap: 10px;
    padding: 10px 20px;
}

.log-input__input {
    flex-grow: 1;
    padding: 0.5em 1.5em;
}
</style>
