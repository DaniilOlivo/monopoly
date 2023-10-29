<template>
    <button>{{ title }}</button>
</template>

<script>
export default {
    name: "ButtonMain",
    props: {
        title: String,
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
</style>
