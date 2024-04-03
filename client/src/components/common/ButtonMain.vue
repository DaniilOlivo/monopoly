<template>
    <button :disabled="disable">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: "ButtonMain",
    props: {
        disable: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
button {
    border: none;
    border-radius: 10px;
    padding: 10px 25px;
    background-color: brown;
    color: white;
    transition: 200ms;
    cursor: pointer;
}

button:hover {
    transform: scale(1.1, 1.1);
}

button:active {
    background-color: chocolate;
}

button:disabled {
    background-color: rgb(76, 20, 20);
    color: gray;
}

button:disabled:hover {
    transform: none;
}
</style>
