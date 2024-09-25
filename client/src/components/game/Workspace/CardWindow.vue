<template>
    <WindowComponent :title="$t('game.card.' + card.typeDeck)">
        <p>{{ card.text }}</p>
        <p v-if="card.desc">{{ card.desc }}</p>

        <template v-slot:btns>
            <ButtonMain @click="clickBtn" :disable="disableBtn">
                {{ $t("game.card." + (cardPayble ? "pay" : "ok")) }}
            </ButtonMain>
        </template>
    </WindowComponent>
</template>

<script>
import WindowComponent from "@/components/common/WindowComponent.vue"
import ButtonMain from '@/components/common/ButtonMain.vue';

import { mapState, mapGetters } from "vuex"
import { gameApi } from "@/socket"

export default {
    name: 'CardWindow',
    components: {
        WindowComponent,
        ButtonMain
    },
    computed: {
        ...mapState(["game"]),

        ...mapGetters(["thisPlayer"]),

        card() {
            return this.thisPlayer.service.card
        },

        cardPayble() {
            const type = this.card.type
            if (type == "repairBuilding") return true
            if (type == "money") return this.card.amount < 0
            return false
        },

        disableBtn() {
            if (this.cardPayble) {
                if (this.card.type == "repairBuilding") {
                    let cost = 0
                    for (const idTile of this.thisPlayer.own) {
                        const tile = this.game.field.tiles.find(tile => tile.id === idTile)
                        if (tile.type != "standard") continue
                        if (tile.hotel) cost += this.card.amountHotel
                        else cost += this.card.amount * tile.building
                    }
                    return cost > this.thisPlayer.money
                } else {
                    return this.card.amount > this.thisPlayer.money
                }
            }
            return false
        }
    },

    methods: {
        clickBtn() {
            gameApi("card", {next: true})
        }
    }
}
</script>
