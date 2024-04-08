<template>
    <div class="card">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: "CardTile",
}

</script>

<style scoped>
.card {
    width: 200px;
    height: 300px;
    
    padding: 5px;
    box-sizing: border-box;

    background-color: white;
    box-shadow: 0 0 0 2px black, 0 0 0 10px white, 0px 5px 10px 10px rgba(34, 60, 80, 0.2);;

    display: flex;
    flex-direction: column;
}
</style>
