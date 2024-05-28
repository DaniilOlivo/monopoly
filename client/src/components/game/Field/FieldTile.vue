<template>
    <div :class="listClasses" ref="tile">
        <div 
            v-if="tile.color"
            :class="classColorCap"
            :style="{'background-color': tile.color}" >
        </div>

        <div class="tile-content" :style="{backgroundColor: colorBg}">
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

            <div class="tile-pledge" :style="{display: tile.pledge ? 'flex' : 'none'}">
                Заложено
                <span class="tile-pledge__owner" :style="{color: colorPlayer}">{{ tile.owner }}</span> 
            </div>
        </div>

        <div class="tile-layout">
            <PlayerChip
                v-for="player in tile.players"
                :key="player.username"
                :username="player.username"
                :color="player.color"
                :arrested="player.arrested > 0"
                :disable="player.disable"></PlayerChip>
        </div>
    </div>
</template>

<script>
import { mapMutations } from "vuex"

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

            return arrClasses
        },

        classColorCap() {
            return "tile__color-cap_" + this.tile.orientation
        },

        colorBg() {
            if (this.tile.owner && !this.tile.pledge) return this.colorPlayer + "99"
            return null
        },

        colorPlayer() {
            const game = this.$store.state.game
            let color = null
            if (this.tile.owner) {
                color = game.players[this.tile.owner].color.primary
            }
            return color
        }
    },

    watch: {
        tile(newTile, oldTile) {
            const newArrPlayers = newTile.players
            const oldArrPlayers = oldTile.players

            const lenNew = newArrPlayers.length
            const lenOld = oldArrPlayers.length

            const diff = (largerArr, smallerArr) => {
                const newArr = largerArr.filter(el1 => !smallerArr.some(el2 => el1.username === el2.username))
                return newArr[0]
            } 

            if (lenNew > lenOld) {
                const diffPlayer = diff(newArrPlayers, oldArrPlayers)
                this.setEndPos(this.getPosTile())
                this.setPlayer(diffPlayer)
            }
            else if (lenOld > lenNew) {
                const diffPlayer = diff(oldArrPlayers, newArrPlayers)
                this.setStartPos(this.getPosTile())
                this.setPlayer(diffPlayer)
            }
        }
    },

    methods: {
        ...mapMutations("field", ["setStartPos", "setEndPos", "setPlayer"]),

        getPosTile() {
            const rect = this.$refs.tile.getBoundingClientRect()
            // We get the center of the tile, where 15 is half the chip so that it is also centered
            return {
                x: rect.x + (rect.width / 2 - 15),
                y: rect.y + (rect.height / 2 - 15)
            }
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

    position: relative;
}

.tile-pledge {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000000a4;

    color: white;
    text-transform: uppercase;
    font-weight: 700;

    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.2em;
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
