<template>
    <WindowComponent :modal="false" :title="titleWindow">
        <p class="deal-window-desc">{{ descWindow }}</p>

        <div class="deal-window-workspace">
            <div class="deal-col">
                <h3>{{ objDeal.initiator ?? "You" }} give:</h3>
                <ListComponent :clickable="!objDeal.initiator" :elements="incomeList"></ListComponent>
                <p>Money: {{ objDeal.moneyIncome }}</p>
                <div class="deal-col__panel">
                    <input type="number" v-model.number="moneyIncome">
                    <ButtonMain
                        title="Give money"
                        @click="clickMoneyIncome"
                        :disable="objDeal.initiator"></ButtonMain>
                </div>
            </div>
            
            <div class="deal-col">
                <h3>{{ (objDeal.initiator) ? "You" : objDeal.target }} give:</h3>
                <ListComponent :clickable="!objDeal.initiator" :elements="hostList"></ListComponent>
                <p>Money: {{ objDeal.moneyHost }}</p>
                <div class="deal-col__panel">
                    <input type="number" v-model.number="moneyHost">
                    <ButtonMain
                        title="Get money"
                        @click="clickMoneyHost"
                        :disable="objDeal.initiator"></ButtonMain>
                </div>
            </div>
        </div>

        <template v-slot:btns>
            <template v-if="objDeal.initiator">
                <ButtonMain title="Refuse" @click="refuse"></ButtonMain>
                <ButtonMain title="Change deal" @click="change"></ButtonMain>
                <ButtonMain title="Accept" @click="accept"></ButtonMain>
            </template>

            <template v-else>
                <ButtonMain title="Cancel" @click="closeDealWindow"></ButtonMain>
                <ButtonMain title="Offer Deal" @click="dealSocket"></ButtonMain>
            </template>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';
import ListComponent from '@/components/common/ListComponent.vue';

import { store } from '@/store';
import { state } from '@/socket';

const mapDesc = {
    "create": "Specify the terms of the transaction. Click on the cells of the field that you want to receive. To remove them from your deal list, simply click on them",
    "income": "Another player wants to offer you a deal. You can refuse, agree or change the terms of the transaction by offering the amended agreement to the initiator of the transaction",
}

export default {
    name: "DealWindow",
    components: {
        WindowComponent,
        ButtonMain,
        ListComponent
    },
    data() {
        return {
            moneyIncome: 0,
            moneyHost: 0
        }
    },
    computed: {
        incomeList() {
            const listObjs = []
            const originList = this.objDeal.income
            const editable = !this.objDeal.initiator

            for (let i = 0; i < originList.length; i++) {
                if (editable) {
                    listObjs.push({
                        title: this.getTitle(originList[i]),
                        click: () => store.deleteIdTile("income", i)
                    })
                } else {
                    listObjs.push(this.getTitle(originList[i]))
                }
                
            }

            return listObjs
        },

        hostList() {
            const listObjs = []
            const originList = this.objDeal.host
            const editable = !this.objDeal.initiator

            for (let i = 0; i < originList.length; i++) {
                if (editable) {
                    listObjs.push({
                        title: this.getTitle(originList[i]),
                        click: () => store.deleteIdTile("host", i)
                    })
                } else {
                    listObjs.push(this.getTitle(originList[i]))
                }
            }

            return listObjs
        },

        objDeal() {
            return store.state.objDeal
        },

        titleWindow() {
            const target = this.objDeal.target
            if (this.objDeal.initiator) return target + " offers you a deal"
            else return "Offer a deal " + target
        },

        descWindow() {
            if (this.objDeal.initiator) return mapDesc["income"]
            else return mapDesc["create"]
        }
    },
    methods: {
        getTitle(idTile) {
            const { game } = state
            const tiles = game.field.tiles
            const tile = tiles.find((tile) => tile.id == idTile)
            if (tile) return tile.title
            else return ""
        },

        clickMoneyIncome() {
            store.setMoney("income", this.moneyIncome)
            this.moneyIncome = 0
        },

        clickMoneyHost() {
            store.setMoney("host", this.moneyHost)
            this.moneyHost = 0
        },

        closeDealWindow() {
            store.closeDealWindow()
        },

        dealSocket() {
            store.dealSocket()
        },

        refuse() {
            store.refuseTradeSocket()
        },

        accept() {
            store.acceptTradeSocket()
        },

        change() {
            const objDeal = store.state.objDeal
            store.refuseTradeSocket()

            objDeal.target = objDeal.initiator
            objDeal.initiator = null

            const income = objDeal.income
            objDeal.income = objDeal.host
            objDeal.host = income

            const money = objDeal.moneyIncome
            objDeal.moneyIncome = objDeal.moneyHost
            objDeal.moneyHost = money

            store.setObjDeal(objDeal)
        }
    }
}
</script>

<style>
.deal-window-workspace {
    display: flex;
    gap: 30px;
}

.deal-window-desc {
    max-width: 600px;
}

.deal-col {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.deal-col__panel {
    display: flex;
    gap: 20px;
}
</style>
