<template>
    <div class="roller">
        <div class="container-roller">
            <img :src="mapDices[dices[0]]" alt="dice" class="dice">
            <img :src="mapDices[dices[1]]" alt="dice" class="dice">
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
            mapDices,
            dices: [1, 1],
        }
    },

    computed: {
        ...mapState([
            "game",
            "previousGame",
            "username"
        ]),

        disable() {
            const { stage, tracker } = this.game
            const username = this.username

            if (stage == "start") return username in tracker.valuesDices
            else {
                const service = this.game.players[username].service
                if (service.offer || service.rent || service.deal || service.card) return true
                return tracker.current != username
            } 
        }
    },

    watch: {
        game(newGameState, oldGameState) {
            if (newGameState.lastAction != "roll") return

            const { stage, tracker, dices } = newGameState
            
            let currentDices = dices
            if (stage == "start" || oldGameState.stage == "start") {
                currentDices = tracker.valuesDices[this.username]

                if (!currentDices || oldGameState.tracker.valuesDices[this.username]) return
            }

            const interval = setInterval(() => {
                this.dices = this.randomArr()
            }, 50);

            setTimeout(() => {
                clearInterval(interval)
                this.dices = currentDices
            }, 800);
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
            gameApi("roll", {dices: this.randomArr()})
        }
    }
}
</script>

<style scoped>
.roller {
    align-self: center;

    padding: 0.5em;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
}

.container-roller {
    padding: 1em;
    border: brown solid 6px;
    box-shadow: 
        0px 5px 10px 2px rgba(60, 60, 80, 0.6) inset,
        5px 5px 12px -1px rgba(34, 60, 80, 0.6);
    

    background-color: rgb(99, 27, 27);
    
    background-size: cover;

    display: flex;
    justify-content: center;
    gap: 1em;
}

.dice {
    width: 50px;
    height: 50px;
}
</style>
