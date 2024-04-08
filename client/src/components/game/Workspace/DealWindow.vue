<template>
    <WindowComponent :title="titleWindow">
        <p class="deal-window-desc">{{ descWindow }}</p>

        <div class="deal-window-workspace">
            <div class="deal-col">
                <h3>{{ objDeal.initiator ?? "You" }} give:</h3>
                <ListComponent :clickable="!objDeal.initiator" :elements="incomeList"></ListComponent>
                <p>Money: {{ objDeal.moneyIncome }}</p>
                <div class="deal-col__panel">
                    <input type="number" v-model.number="moneyIncome">
                    <ButtonMain
                        @click="clickMoneyIncome"
                        :disable="!!objDeal.initiator">Give money</ButtonMain>
                </div>
            </div>
            
            <div class="deal-col">
                <h3>{{ (objDeal.initiator) ? "You" : objDeal.target }} give:</h3>
                <ListComponent :clickable="!objDeal.initiator" :elements="hostList"></ListComponent>
                <p>Money: {{ objDeal.moneyHost }}</p>
                <div class="deal-col__panel">
                    <input type="number" v-model.number="moneyHost">
                    <ButtonMain
                        @click="clickMoneyHost"
                        :disable="!!objDeal.initiator">Get money</ButtonMain>
                </div>
            </div>
        </div>

        <template v-slot:btns>
            <template v-if="objDeal.initiator">
                <ButtonMain @click="refuse">Refuse</ButtonMain>
                <ButtonMain @click="change">Change deal</ButtonMain>
                <ButtonMain @click="accept">Accept</ButtonMain>
            </template>

            <template v-else>
                <ButtonMain @click="closeDeal">Cancel</ButtonMain>
                <ButtonMain @click="dealSocket">Offer deal</ButtonMain>
            </template>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';
import ListComponent from '@/components/common/ListComponent.vue';

import { mapMutations, mapState } from "vuex"
import { gameApi } from "@/socket"

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
        ...mapState([
            "game",
        ]),

        ...mapState("deal", {objDeal: "localObjectDeal"}),

        incomeList() {
            return this.getList("income")
        },

        hostList() {
            return this.getList("host")
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
        ...mapMutations("deal", [
            "dealDeleteTile",
            "closeDeal",
            "setMoney",
            "setDeal"
        ]),

        getTitle(idTile) {
            const tile = this.game.field.tiles.find((tile) => tile.id == idTile)
            if (tile) return tile.title
            else return ""
        },

        getList(side) {
            const listObjs = []
            const sourceList = this.objDeal[side]
            const editable = !this.objDeal.initiator

            for (let i = 0; i < sourceList.length; i++) {
                if (editable) {
                    listObjs.push({
                        title: this.getTitle(sourceList[i]),
                        click: () => this.dealDeleteTile({side, index: i})
                    })
                } else {
                    listObjs.push(this.getTitle(sourceList[i]))
                }
            }

            return listObjs
        },

        clickMoneyIncome() {
            this.setMoney({side: "income", amount: this.moneyIncome})
            this.moneyIncome = 0
        },

        clickMoneyHost() {
            this.setMoney({side: "host", amount: this.moneyHost})
            this.moneyHost = 0
        },

        dealSocket() {
            gameApi("deal", this.objDeal)
            this.closeDeal()
        },

        refuse() {
            gameApi("trade", false)
            this.closeDeal()
        },

        accept() {
            gameApi("trade", true)
            this.closeDeal()
        },

        change() {
            const objDeal = this.objDeal
            this.refuse()

            objDeal.target = objDeal.initiator
            objDeal.initiator = ""

            const income = objDeal.income
            objDeal.income = objDeal.host
            objDeal.host = income

            const money = objDeal.moneyIncome
            objDeal.moneyIncome = objDeal.moneyHost
            objDeal.moneyHost = money

            this.setDeal(objDeal)
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
