<template>
    <CardTile>
        <h3 class="card-communal__title">{{ tile.title }}</h3>

        <p class="card-communal__desc" v-for="desc in tile.desc" :key="desc">
            {{ desc }}
        </p>
    </CardTile>
</template>

<script>
import CardTile from './CardTile.vue';

export default {
    name: "CardTileCommunal",
    components: {
        CardTile
    },
    props: {
        tile: Object
    }
}
</script>

<style scoped>
.card-communal__title {
    text-align: center;
}

.card-communal__desc {
    flex-grow: 1;
    text-align: center;
}
</style>
