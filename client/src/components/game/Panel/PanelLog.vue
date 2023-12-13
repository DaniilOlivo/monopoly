<template>
    <div class="log">
        <div class="list-log" ref="listLog">
            <p 
                class="line-log"
                v-for="line in listLogs"
                :key="line.id" >
                <span 
                    class="line-log__sender"
                    v-if="line.sender != 'system'"
                    :style="{color: line.color}" >{{ line.sender }}:</span>
                <span class="line-log__mes">{{ line.mes }}</span>
                <span class="line-log__bold" v-if="line.bold">{{ line.bold }}</span>
            </p>
        </div>

        <div class="log-input">
            <input type="text" class="log-input__input" v-model="mes" @keyup.enter="sendMes">
            <ButtonMain title="Message" @click="sendMes"></ButtonMain>
        </div>
    </div>
</template>

<script>
import ButtonMain from "@/components/common/ButtonMain.vue"

import { state, socket } from "@/socket"

export default {
    name: "PanelLog",
    components: {
        ButtonMain
    },
    data() {
        return {
            mes: ""
        }
    },
    computed: {
        listLogs() {

            const {logs, players} = state.game
            
            let count = 0
            logs.forEach((objLog) => {
                objLog.id = count
                objLog.color = players[objLog.sender].color
                count++
            })

            return logs
        }
    },
    methods: {
        sendMes() {
            socket.emit("sendMes", this.mes)
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

.line-log__sender, .line-log__bold  {
    font-weight: bold;
}

.line-log__mes {
    margin: 0 10px;
}
</style>
