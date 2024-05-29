<template>
    <WindowComponent title="Property management">
        <CardDispather :tile="tile"></CardDispather>
        <div class="info">
            <p class="info_warning" v-if="tile.pledge">Property is mortgaged</p>
        </div>
        <template v-slot:btns>
            <ButtonMain @click="unselect">Close</ButtonMain>
            <ButtonMain @click="clickSell" :disable="disableBtns || anyBuilding">Sell</ButtonMain>
            <ButtonMain @click="clickRedeemPledge" v-if="tile.pledge" :disable="disableBtns">Redeem Pledge</ButtonMain>
            <ButtonMain @click="clickPutPledge" v-else :disable="disableBtns">Put Pledge</ButtonMain>
            <template v-if="monopoly">
                <ButtonMain 
                    @click="clickAddBuilding"
                    :disable="disableBtns || tile.hotel || notEnoughMoney"
                     >{{ (tile.building == 4) ? 'Buy hotel' : 'Buy building' }}</ButtonMain>
                <ButtonMain 
                    @click="clickRemoveBuilding"
                    :disable="disableBtns || tile.building == 0"
                    >{{ (tile.hotel) ? 'Sell hotel' : 'Sell building' }}</ButtonMain>
            </template>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';
import CardDispather from '../cards/CardDispather.vue';
import ButtonMain from '@/components/common/ButtonMain.vue';

import { mapState, mapGetters, mapMutations } from 'vuex';
import { gameApi } from "@/socket"

export default {
    name: "OwnWindwow",
    components: {
        WindowComponent,
        CardDispather,
        ButtonMain
    },

    computed: {
        ...mapState([
            "username",
            "game"
        ]),

        ...mapGetters(["thisPlayer", "monopolyAnyBuilding"]),

        ...mapGetters("workspace", {tile: "selectOwn"}),

        disableBtns() {
            return this.game.tracker.current != this.username
        },

        monopoly() {
            if (!this.tile.color) return false
            const monopoly = this.thisPlayer.monopoly[this.tile.color]
            return monopoly == this.tile.numberTilesArea
        },

        notEnoughMoney() {
            return this.tile.priceBuilding > this.thisPlayer.money 
        },

        anyBuilding() {
            if (!this.tile.color) return false
            return this.monopolyAnyBuilding(this.tile.color)
        }
    },

    methods: {
        ...mapMutations("workspace", ["unselect"]),

        clickSell() {
            gameApi("sell", {idTile: this.tile.id})
        },
        clickPutPledge() {
            gameApi("pledge", {idTile: this.tile.id, type: "put"})
            this.unselect()
        },
        clickRedeemPledge() {
            gameApi("pledge", {idTile: this.tile.id, type: "redeem"})
        },
        clickAddBuilding() {
            gameApi("build", {idTile: this.tile.id, type: "add"})
        },
        clickRemoveBuilding() {
            gameApi("build", {idTile: this.tile.id, type: "remove"})
        }
    }
}
</script>

<style scoped>
.info p {
    text-align: center;
}

.info_warning {
    color: brown;
    font-weight: bold;
}
</style>
