<template>
    <div class="player-memo-container">
        <div :class="['player-memo', {'player-memo_active': thisPlayerTurn}]">
            <div :class="['player-memo-content', {'player-memo-content_hidden': !display}]">
                <h1 class="player-memo-content__title">Your move</h1>

                <div class="player-memo-content-text">
                    <p v-if="arrested">You are under arrest!</p>
                    <p>Here's what you can do:</p>

                    <ul v-if="arrested" class="player-memo-content-text__list">
                        <li>Use your jailbreak (if you have one)</li>
                        <li>Roll a double on the dice</li>
                        <li>If none of this works, then sit and wait</li>
                    </ul>
                    <ul v-else class="player-memo-content-text__list">
                        <li>Offer a deal to another player. (By clicking on his card on the right)</li>
                        <li>Manage your property (by clicking on one of your cells)</li>
                        <li>Roll the dice (after this your turn is over)</li>
                    </ul>
                </div>

                <ButtonMain v-if="arrested" @click="clickJailbreak" :disable="thisPlayer.releasePrison == 0">Use Jailbreak</ButtonMain>
            </div>
        </div>
    </div>
</template>

<script>
import ButtonMain from "@/components/common/ButtonMain.vue";

import { gameApi } from "@/socket";
import { mapGetters } from "vuex"

export default {
    name: "PlayerMemo",

    components: {
        ButtonMain
    },

    data() {
        return {
            display: false
        }
    },

    computed: {
        ...mapGetters(["thisPlayerTurn", "thisPlayer"]),

        arrested() {
            return this.thisPlayer.arrested > 0
        }
    },

    watch: {
        thisPlayerTurn(newVal) {
            if (newVal) {
                setTimeout(() => {
                    this.display = true;
                }, 300);
            } else {
                this.display = false;
            }
        }
    },

    methods: {
        clickJailbreak() {
            gameApi("jailbreak")
        }
    }
}
</script>

<style scoped>
.player-memo-container {
    grid-row: 1;
    grid-column: 2;
}

.player-memo {
    width: 0;
    height: 100%;
    overflow: hidden;

    background-color: white;
    box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
    border-radius: 0 15px 15px 0;

    transition: 300ms;
}

.player-memo_active {
    width: 100%;
}

.player-memo-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em 0.5em;
    gap: 1em;
}

.player-memo-content_hidden {
    display: none;
}

.player-memo-content__title {
    color: brown;
    font-size: 26px;
    text-transform: uppercase;
}

.player-memo-content-text {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
}

.player-memo-content-text__list {
    color: brown;
    font-weight: 600;
    font-size: 16px;
    margin-left: 20px;
}

.player-memo-content-text__list li {
    margin-bottom: 1em;
}
</style>
