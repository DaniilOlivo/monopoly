<template>
    <CardTile>
        <div
            class="card__header"
            :style="{'background-color': tile.color}" >
            <p>Карта собственности</p>
            <h3>{{ tile.title }}</h3>
        </div>

        <div class="rent-block">
            <div class="block-line" v-for="(rent, label) in mapRent" :key="label">
                <span>{{ label }}</span>
                <span class="block-line__money">M {{ rent }}</span>
            </div>
        </div>

        <div class="cost-block">
            <div class="block-line">
                <span>Цена дома</span>
                <span class="block-line__money">M {{ tile.priceBuilding }}</span>
            </div>

            <div class="block-line">
                <span>Цена отеля</span>
                <span class="block-line__money">M {{ tile.priceBuilding }}</span>
            </div>
        </div>
    </CardTile>
</template>

<script>
import CardTile from './CardTile.vue';

export default {
    name: "CardTileStandard",
    props: {
        tile: Object
    },
    components: {
        CardTile,
    },
    computed: {
        mapRent() {
            return {
                "Рента": this.tile.rent_basic,
                "Все карточки этого цвета": this.tile.rent_basic * 2,
                "1 дом": this.tile.rent_1_house,
                "2 дома": this.tile.rent_2_house,
                "3 дома": this.tile.rent_3_house,
                "4 дома": this.tile.rent_4_house,
                "Отель": this.tile.rent_hotel
            }
        }
    }
}
</script>

<style scoped>
.card__header {
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card__header h3 {
    text-align: center;
}

.rent-block {
    border-bottom: 1px solid black;
    flex-grow: 1;
}

.block-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1em;
}

.block-line__money {
    font-weight: bold;
    white-space: nowrap;
}
</style>
