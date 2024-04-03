<template>
    <WindowComponent title="Property management">
        <CardDispather :tile="tile"></CardDispather>
        <div class="info">
            <p class="info_warning" v-if="pledge">Property is mortgaged</p>
        </div>
        <template v-slot:btns>
            <ButtonMain @click="closeOwn">Close</ButtonMain>
            <ButtonMain @click="clickSell" :disable="disableBtns || tile.building > 0">Sell</ButtonMain>
            <ButtonMain @click="clickRedeemPledge" v-if="pledge" :disable="disableBtns">Redeem Pledge</ButtonMain>
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

import { mapState } from 'vuex';
import { gameApi } from "@/socket"

export default {
    name: "OwnWindwow",
    components: {
        WindowComponent,
        CardDispather,
        ButtonMain
    },
    props: {
        tile: Object
    },
    methods: {
        clickSell() {
            gameApi("sell", this.tile.id)
        },
        clickPutPledge() {
            gameApi("pledge", "put", this.tile.id)
        },
        clickRedeemPledge() {
            gameApi("pledge", "redeem", this.tile.id)
        },
        clickAddBuilding() {
            gameApi("building", "add", this.tile.id)
        },
        clickRemoveBuilding() {
            gameApi("building", "remove", this.tile.id)
        }
    },
    computed: {
        ...mapState([
            "username",
            "game"
        ]),

        pledge() {
            return this.tile.pledge
        },

        disableBtns() {
            return this.game.tracker.current != this.username
        },

        monopoly() {
            if (!this.tile.color) return false
            const monopoly = this.game.players[this.username].monopoly[this.tile.color]
            const count = this.tile.count
            return monopoly == count
        },

        notEnoughMoney() {
            const money = this.game.players[this.username].money
            return this.tile.priceBuilding > money 
        }
    },
    inject: ["closeOwn"]
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
