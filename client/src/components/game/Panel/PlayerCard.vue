<template>
    <div :class="classList">
        <div class="player-card__marker" :style="{'background-color': color}"></div>
        <p class="player-card__username">{{ username }}</p>
        <p class="player-card__money">{{ money }} М</p>
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
        color: String,
        username: String,
        money: Number
    },
    computed: {
        classList() {
            return [
                'player-card',
                {
                    'player-card_select': this.select,
                    'player-card_pointer': this.pointer
                }
            ]
        }
    }
}

</script>

<style scoped>
.player-card {
    display: flex;
    gap: 15px;
    padding: 20px 30px;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);
    transition: 200ms;
}

.palyer-card_select {
    border: lightblue 2px solid;
}

.player-card_pointer {
    cursor: pointer;
}

.player-card_pointer:hover {
    background-color: lightblue;
}

.player-card__marker {
    width: 10px;
}

.player-card__username {
    flex-grow: 1;
}

.player-card__money {
    font-family: 'Courier New', Courier, monospace;
}
</style>
