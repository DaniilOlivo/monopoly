<template>
    <CardTile>
        <h3 class="card-station__title">{{ tile.title }}</h3>

        <div class="rent-block">
            <div class="block-line" v-for="(rent, label) in mapRent" :key="label">
                <span>{{ $t("game.cardTile.mapStations." + label) }}</span>
                <span class="block-line__money">M {{ rent }}</span>
            </div>
        </div>
    </CardTile>
</template>

<script>
import CardTile from './CardTile.vue';

export default {
    name: "CardTileStation",
    props: {
        tile: Object
    },
    components: {
        CardTile
    },
    computed: {
        mapRent() {
            return {
                "rent": 25,
                "2stations": 50,
                "3stations": 100,
                "4stations": 200
            }
        }
    }
}
</script>

<style scoped>
.card-station__title {
    text-align: center;
}
.block-line {
    display: flex;
    justify-content: space-between;
}

.block-line__money {
    font-weight: bold;
}
</style>
