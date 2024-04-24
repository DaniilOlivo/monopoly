<template>
    <div :class="listClasses" :style="{borderBottomColor: colorPlayer}">
        <div 
            v-if="tile.color"
            :class="classColorCap"
            :style="{'background-color': tile.color}" >
        </div>

        <div class="tile-content">
            <h3 
                v-if="tile.title"
                class="tile-content__title" >
                {{ tile.title }}
            </h3>

            <h4
                v-if="tile.price"
                class="tile-content__price" >
                {{ tile.price }} M.
            </h4>

            <div class="building-line">
                <template v-if="tile.building < 5 && tile.building > 0">
                    <img :src="buildingImg" v-for="number in tile.building" :key="number">
                </template>
                <img :src="hotelImg" v-if="tile.hotel">
            </div>
        </div>

        <div class="tile-layout">
            <PlayerChip
                v-for="player in tile.players"
                :key="player.username"
                :color="player.color"
                :arrested="player.arrested > 0"></PlayerChip>
        </div>
    </div>
</template>

<script>
import PlayerChip from "./PlayerChip.vue"

import buildingImg from "./img/building.png"
import hotelImg from "./img/hotel.png"

export default {
    name: "FieldTile",
    components: {
        PlayerChip
    },
    props: {
        tile: {
            type: Object,
            required: true
        }
    },

    data() {
        return {
            buildingImg,
            hotelImg
        }
    },

    computed: {
        listClasses() {
            const arrClasses = ["tile",]

            if (this.tile.orientation == "horizontal") arrClasses.push("tile_horizontal")
            if (this.tile.orientation == "vertical") arrClasses.push("tile_vertical")

            if (this.tile.owner) arrClasses.push("tile_owner")
            if (this.tile.pledge) arrClasses.push("tile_pledge")
            return arrClasses
        },

        classColorCap() {
            return "tile__color-cap_" + this.tile.orientation
        },

        colorPlayer() {
            const game = this.$store.state.game
            let color = "black"
            if (this.tile.owner) {
                color = game.players[this.tile.owner].color
            }
            return color
        }
    }
}
</script>

<style>
.tile {
    background-color: #C3E8C6;
    border: black solid 2px;

    display: flex;

    position: relative;
}

.tile_horizontal {
    flex-direction: column;
}

.tile_vertical {
    flex-direction: row;
}

.tile-content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.tile_pledge {
    background-color: #718772;
}

.tile_owner {
    border-bottom: 6px solid black;
}

.tile__color-cap_horizontal {
    height: 20px;
    border-bottom: 4px solid black;
}

.tile__color-cap_vertical {
    width: 20px;
    height: 100%;
    border-right: 4px solid black;
}

.tile-content__title {
    font-size: 16px;
    text-align: center;
    flex-grow: 1;
}

.tile-content__price {
    font-size: 14px;
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
    padding: 10px;
}

.tile-layout {
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;

    padding: 10px;
}

.building-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    display: flex;
    justify-content: center;
    gap: 5px;
}
</style>
