<template>
    <p class="log-line">
        <span class="log-line__sender" :style="{color}">{{ sender }}</span>
        <span class="log-line__message" :style="style">{{ mes }}</span>
        <span class="log-line__bold" :style="style" v-if="bold">{{ bold }}</span>
    </p>
</template>

<script>
export default {
    name: "LineLogger",
    props: {
        sender: {
            type: String,
            required: true
        },
        mes: {
            type: String,
            required: true
        },
        bold: String,
        color: {
            type: String,
            required: true
        },
        flagError: Boolean,
    },
    computed: {
        style() {
            return {
                color: this.flagError ? "darkred" : "white"
            }
        }
    }
}
</script>

<style scoped>
.log-line__sender, .log-line__bold {
    font-weight: bold;
}

.log-line__message {
    margin: 0 10px;
}
</style>
