<template>
    <WindowComponent :title="titleWindow">
        <p class="deal-window-desc">
            {{ $t("game.deal.desc." + (objDeal.initiator ? "income" : "create"))  }}
        </p>

        <div class="deal-window-workspace">
            <div class="deal-col">
                <h3>{{ objDeal.initiator ?? $t("game.deal.you") }} {{ $t("game.deal.give") }}:</h3>
                <ListComponent :clickable="!objDeal.initiator" :elements="incomeList"></ListComponent>
                
                <div class="deal-col__panel">
                    <label>{{ $t("game.deal.money.give") }}:</label>
                    <input type="number" v-model.number="moneyIncome" :disabled="objDeal.initiator">
                </div>
            </div>
            
            <div class="deal-col">
                <h3>{{ (objDeal.initiator) ? $t("game.deal.you") : objDeal.target }} {{ $t("game.deal.give") }}:</h3>
                <ListComponent :clickable="!objDeal.initiator" :elements="hostList"></ListComponent>
                
                <div class="deal-col__panel">
                    <label>{{ $t("game.deal.money.get") }}:</label>
                    <input type="number" v-model.number="moneyHost" :disabled="objDeal.initiator">
                </div>
            </div>
        </div>

        <template v-slot:btns>
            <template v-if="objDeal.initiator">
                <ButtonMain @click="refuse">{{ $t("game.deal.btns.refuse") }}</ButtonMain>
                <ButtonMain @click="change">{{ $t("game.deal.btns.change") }}</ButtonMain>
                <ButtonMain @click="accept">{{ $t("game.deal.btns.accept") }}</ButtonMain>
            </template>

            <template v-else>
                <ButtonMain @click="closeDeal">{{ $t("game.deal.btns.cancel") }}</ButtonMain>
                <ButtonMain @click="dealSocket">{{ $t("game.deal.btns.deal") }}</ButtonMain>
            </template>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';
import ListComponent from '@/components/common/ListComponent.vue';

import { mapMutations, mapState, mapGetters } from "vuex"
import { gameApi } from "@/socket"


export default {
    name: "DealWindow",
    components: {
        WindowComponent,
        ButtonMain,
        ListComponent
    },
    computed: {
        ...mapState([
            "game",
        ]),

        ...mapState("deal", {objDeal: "localObjectDeal"}),

        ...mapGetters(["thisPlayer", "tilesMonopoly", "monopolyAnyBuilding"]),

        moneyIncome: {
            get() {
                return this.objDeal.moneyIncome
            },

            set(value) {
                const moneyThisPlayer = this.thisPlayer.money
                this.setMoney({
                    side: "income",
                    amount: moneyThisPlayer < value ? moneyThisPlayer : value
                })
            }
        },

        moneyHost: {
            get() {
                return this.objDeal.moneyHost
            },

            set(value) {
                const moneyPlayerTarget = this.game.players[this.objDeal.target].money
                this.setMoney({
                    side: "host",
                    amount: moneyPlayerTarget < value ? moneyPlayerTarget : value
                })
            }
        },

        incomeList() {
            return this.getList("income")
        },

        hostList() {
            return this.getList("host")
        },

        titleWindow() {
            const target = this.objDeal.target
            if (this.objDeal.initiator) return target + this.$t("game.deal.title.income")
            else return this.$t("game.deal.title.outgoing") + target
        }
    },
    methods: {
        ...mapMutations("deal", [
            "dealDeleteTile",
            "closeDeal",
            "setMoney",
            "setDeal"
        ]),

        getTile(idTile) {
            return this.game.field.tiles.find((tile) => tile.id == idTile)
        },

        getList(side) {
            const listObjs = []
            const sourceList = this.objDeal[side]
            const editable = !this.objDeal.initiator

            for (let i = 0; i < sourceList.length; i++) {
                const tile = this.getTile(sourceList[i])
                if (!tile) continue
                const obj = {label: tile.title}
                if (editable) obj.click = () => this.removeElList(tile, side, i)
                listObjs.push(obj)
            }

            return listObjs
        },

        removeElList(tile, side, index) {
            if (tile.color && this.monopolyAnyBuilding) {
                const tiles = this.tilesMonopoly(tile.color)
                for (const t of tiles) {
                    const i = this.objDeal[side].indexOf(t.id)
                    if (i == -1) continue
                    this.dealDeleteTile({side, index: i})
                }
            } else this.dealDeleteTile({side, index})
        },

        dealSocket() {
            gameApi("deal", {objDeal: this.objDeal})
            this.closeDeal()
        },

        refuse() {
            gameApi("trade", {refuse: true})
            this.closeDeal()
        },

        accept() {
            gameApi("trade")
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
