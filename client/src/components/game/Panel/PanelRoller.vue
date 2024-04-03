<template>
    <div class="roller">
        <div class="container-roller">
            <img :src="mapDices[valuesDices[0]]" alt="dice" class="dice">
            <img :src="mapDices[valuesDices[1]]" alt="dice" class="dice">
        </div>
        <ButtonMain :disable="disable" @click="roll">Roll</ButtonMain>
    </div>
</template>

<script>
import ButtonMain from "@/components/common/ButtonMain.vue"

import { mapState } from "vuex"
import { gameApi } from "@/socket"

import dice_1 from "./img/dice_1.png"
import dice_2 from "./img/dice_2.png"
import dice_3 from "./img/dice_3.png"
import dice_4 from "./img/dice_4.png"
import dice_5 from "./img/dice_5.png"
import dice_6 from "./img/dice_6.png"

const mapDices = {
    1: dice_1,
    2: dice_2,
    3: dice_3,
    4: dice_4,
    5: dice_5,
    6: dice_6,
}

export default {
    name: "PanelRoller",
    components: {
        ButtonMain
    },

    data() {
        return {
            mapDices
        }
    },

    computed: {
        ...mapState([
            "game",
            "previousGame",
            "username"
        ]),
        
        valuesDices() {
            const {stage, tracker, dices} = this.game
            if (stage == "start" || this.previousGame.stage == "start") {
                const currentDices = tracker.valuesDices[this.username]
                if (currentDices) return currentDices
                else return [1, 1]
            } else return dices
        },

        disable() {
            const { stage, tracker } = this.game
            const username = this.username

            if (stage == "start") return username in tracker.valuesDices
            else {
                const service = this.game.players[username].service
                if (service.offer || service.rent || service.deal) return true
                return tracker.current != username
            } 
        }
    },

    methods: {
        randomInt() {
            return Math.ceil(Math.random() * 6)
        },

        randomArr() {
            return [this.randomInt(), this.randomInt()]
        },

        roll() {
            gameApi("roll", this.randomArr())
        }
    }
}
</script>

<style scoped>
.roller {
    padding: 20px;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.container-roller {
    display: flex;
    justify-content: center;
    gap: 20px;
}

.dice {
    width: 50px;
    height: 50px;
}
</style>
