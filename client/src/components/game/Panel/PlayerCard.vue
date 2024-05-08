<template>
    <div :class="classList">
        <div class="player-card__marker" :style="{'background-color': color.primary}"></div>
        <div :class="['player-card-content', {'player-card-content_select': select}]">
            <p class="player-card__username">{{ username }}</p>
            <p class="player-card__money">{{ money }} М</p>

            <div class="player_card__deal" v-show="pointer">
                Offer a deal
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PlayerCard",
    props: {
        select: {
            type: Boolean,
            default: false
        },
        pointer: {
            type: Boolean,
            default: true
        },
        color: Object,
        username: String,
        money: Number,
        disable: Boolean
    },
    computed: {
        classList() {
            return [
                'player-card',
                {
                    'player-card_pointer': this.pointer,
                    'player-card_disable': this.disable
                }
            ]
        }
    }
}

</script>

<style scoped>
.player-card {
    display: flex;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
    transition: 200ms;
}

.player-card-content {
    flex-grow: 1;

    padding: 20px 30px;

    display: flex;
    justify-content: space-between;

    position: relative;
}

.player_card__deal {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    transition: 200ms;

    display: flex;
    justify-content: center;
    align-items: center;

    text-transform: uppercase;

    background-color: rgba(255, 255, 255, 0.8);
}

.player_card__deal:hover {
    opacity: 1;
}

.player-card-content_select {
    border: lightblue 4px solid;
}

.player-card_pointer {
    cursor: pointer;
}

.player-card_disable {
    background-color: rgba(30, 30, 30, 0.4);
}

.player-card__marker {
    width: 20px;
}

.player-card__money {
    font-family: 'Courier New', Courier, monospace;
}
</style>
