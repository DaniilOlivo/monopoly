<template>
    <WindowComponent :title="titleWindow">
        <p class="deal-window-desc">
            {{ $t(`game.deal.${mode}.desc`) }}
        </p>

        <div class="deal-window-workspace">
            <div class="deal-col">
                <h3>{{ $t("game.deal.leftCol.title") }}:</h3>
                <ListComponent 
                    :clickable="editable"
                    :elements="getList(sideLeft)"></ListComponent>
                
                <div class="deal-col__panel">
                    <label>{{ $t("game.deal.leftCol.money") }}:</label>
                    <input type="number" v-model.number="valMoneyLeft" :disabled="!editable">
                </div>
            </div>
            
            <div class="deal-col">
                <h3>
                    {{ objDeal[sideRight].username }}
                    {{ $t("game.deal.rightCol.title") }}:
                </h3>
                <ListComponent
                    :clickable="editable"
                    :elements="getList(sideRight)"></ListComponent>
                
                <div class="deal-col__panel">
                    <label>{{ $t("game.deal.rightCol.money") }}:</label>
                    <input type="number" v-model.number="valMoneyRight" :disabled="!editable">
                </div>
            </div>
        </div>

        <template v-slot:btns>
            <template v-if="mode == 'income'">
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

import { mapMutations, mapActions, mapState, mapGetters } from "vuex"
import { gameApi } from "@/socket"


export default {
    name: "DealWindow",
    components: {
        WindowComponent,
        ButtonMain,
        ListComponent
    },

    data() {
        return {
            valMoneyLeft: 0,
            valMoneyRight: 0
        }
    },

    created() {
        this.valMoneyLeft = this.objDeal[this.sideLeft].money
        this.valMoneyRight = this.objDeal[this.sideRight].money
    },

    computed: {
        ...mapState([
            "game",
        ]),

        ...mapState("deal", {
            objDeal: "localObjectDeal",
            activeDeal: "active",
            mode: "mode"
        }),

        ...mapGetters([
            "thisPlayer",
            "tilesMonopoly",
            "monopolyAnyBuilding"
        ]),

        sideLeft() {
            return (this.mode == "create") ? "initiator" : "target"
        },

        sideRight() {
            return (this.mode == "create") ? "target" : "initiator"
        },
 
        titleWindow() {
            const username =
                (this.mode == "create") ?
                this.objDeal.target.username :
                this.objDeal.initiator.username
            
            return this.$t(`game.deal.${this.mode}.title`, {username})
        },

        editable() {
            return this.mode == "create"
        }
    },

    watch: {
        valMoneyLeft(newValue) {
            const moneyThisPlayer = this.thisPlayer.money
            if (newValue) {
                if (newValue < 0) this.valMoneyLeft = 0
                else this.valMoneyLeft = Math.min(newValue, moneyThisPlayer)
            }
        },

        valMoneyRight(newValue) {
            const targetUsername = this.objDeal.target.username
            const moneyPlayerTarget = this.game.players[targetUsername].money
            if (newValue) {
                if (newValue < 0) this.valMoneyRight = 0
                else this.valMoneyRight = Math.min(newValue, moneyPlayerTarget)
            }
        }
    },

    methods: {
        ...mapMutations("deal", [
            "dealDeleteTile",
            "setMoney",
            "setMode"
        ]),

        ...mapActions("deal", [
            "closeDeal",
            "setDeal"
        ]),

        getTile(idTile) {
            return this.game.field.tiles.find((tile) => tile.id == idTile)
        },

        getList(side) {
            const listObjs = []
            const sourceList = this.objDeal[side].property

            for (let i = 0; i < sourceList.length; i++) {
                const tile = this.getTile(sourceList[i])
                if (!tile) continue
                const obj = {label: tile.title}
                if (this.editable) obj.click = () => this.removeElList(tile, side, i)
                listObjs.push(obj)
            }

            return listObjs
        },

        removeElList(tile, side, index) {
            const color = tile.color
            if (color && this.monopolyAnyBuilding(color)) {
                const tiles = this.tilesMonopoly(color)
                for (const t of tiles) {
                    const i = this.objDeal[side].property.indexOf(t.id)
                    if (i == -1) continue
                    this.dealDeleteTile({side, index: i})
                }
            } else this.dealDeleteTile({side, index})
        },

        dealSocket() {
            this.setMoney({side: "initiator", amount: this.valMoneyLeft ?? 0})
            this.setMoney({side: "target", amount: this.valMoneyRight ?? 0})
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
            const newObjDeal = structuredClone(this.objDeal)
            this.refuse()

            const temp = newObjDeal.initiator
            newObjDeal.initiator = newObjDeal.target
            newObjDeal.target = temp

            this.setDeal({obj: newObjDeal, mode: "create"})
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
