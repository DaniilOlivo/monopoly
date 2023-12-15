<template>
    <div :class="listClasses" :style="{borderBottomColor: colorPlayer}">
        <div 
            v-if="tile.color"
            class="tile__color-cap"
            :style="{'background-color': tile.color}" >
        </div>

        <h3 
            v-if="tile.title"
            class="tile__title" >
            {{ tile.title }}
        </h3>

        <h4
            v-if="tile.price"
            class="tile__price" >
            {{ tile.price }} M.
        </h4>

        <div class="tile-layout">
            <div 
                v-for="color in tile.players"
                class="player-chip"
                :style="{'background-color': color}"
                :key="color" >
            </div>
        </div>
    </div>
</template>

<script>
import { state } from "@/socket"

export default {
    name: "FieldTile",
    props: {
        type: {
            default: "rectangle",
            type: String,
            validator(value) {
                const result = ["square", "rectangle"].indexOf(value)
                return result != -1
            }
        },

        tile: {
            type: Object,
            required: true
        }
    },

    computed: {
        listClasses() {
            const arrClasses = ["tile", "tile_" + this.type]
            if (this.tile.owner) arrClasses.push("tile_owner")
            if (this.tile.pledge) arrClasses.push("tile_pledge")
            return arrClasses
        },
        colorPlayer() {
            const { game } = state
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
    height: 180px;
    background-color: #C3E8C6;
    border: black solid 2px;

    display: flex;
    flex-direction: column;

    position: relative;
}

.tile_pledge {
    background-color: #718772;
}

.tile_owner {
    border-bottom: 6px solid black;
}

.tile_rectangle {
    width: 120px;
}

.tile_square {
    width: 180px;
}

.tile__color-cap {
    height: 30px;
    border-bottom: 4px solid black;
}

.tile__title {
    padding: 10px 5px;
    text-align: center;
    flex-grow: 1;
}

.tile__price {
    text-align: center;
    font-family: 'Courier New', Courier, monospace;
    padding: 20px;
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
    gap: 20px;
}

.player-chip {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}
</style>
