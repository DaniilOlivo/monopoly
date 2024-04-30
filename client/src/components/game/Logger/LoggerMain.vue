<template>
    <div class="log">
        <div class="log-container">
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
.log {
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

.log-container {
    display: flex;
    flex-direction: column;
    width: 70%;
    height: 70%;
}

.list-log {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    background-color: rgba(50, 50, 50, 0.95);
    overflow-y: scroll;
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
    display: flex;
    gap: 10px;
    padding: 10px 20px;
}

.log-input__input {
    flex-grow: 1;
    padding: 0.5em 1.5em;
}
</style>
