<template>
    <CardTile>
        <h3 class="card-station__title">{{ tile.title }}</h3>

        <div class="rent-block">
            <div class="block-line" v-for="(rent, label) in mapRent" :key="label">
                <span>{{ label }}</span>
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
            const obj = {}
            const labels = ["Rent", "2 stations", "3 stations", "4 stations"]

            for (let i = 0; i < labels.length; i++) {
                const label = labels[i]
                const value = this.tile.rent[i]
                obj[label] = value
            }

            return obj
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
