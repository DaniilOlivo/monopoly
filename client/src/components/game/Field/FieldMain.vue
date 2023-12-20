<template>
    <div class="field">
        <FieldTile
            v-for="(tile, id) in tiles.special"
            type="square"
            :tile="tile"
            :key="id" 
            :id="id" >
        </FieldTile>

        <div
            v-for="(arrTiles, classLine) of tiles.lines"
            :class="['line', 'line_'+ classLine]"
            :key="classLine" >
            <FieldTile
                v-for="tile in arrTiles"
                :key="tile.id"
                :tile="tile"
                type="rectangle"
                @mouseenter="showCard(tile)"
                @mouseleave="hideCard()"
                @click="clickOwn(tile)" >
            </FieldTile>
        </div>

        <div class="logo">
            <h1 class="logo__title" @click="countClickLogo++">MONOPOLY</h1>
            <FieldWorkspace
                :cardHover="cardHover"
                :selectOwn="selectOwn"></FieldWorkspace>
        </div>

        <ConsoleDev v-show="countClickLogo >= 5"></ConsoleDev>
    </div>
</template>

<script>
import FieldTile from './FieldTile.vue';
import FieldWorkspace from './FieldWorkspace.vue';
import ConsoleDev from "@/components/devComponents/ConsoleDev.vue"

import { state } from "@/socket"

export default {
    name: "FieldMain",
    components: {
        FieldTile,
        FieldWorkspace,
        ConsoleDev
    },
    data() {
        return {
            cardHoverIndex: -1,
            selectOwnIndex: -1,
            countClickLogo: 0
        }
    },
    computed: {
        tiles() {
            const resultObj = {special: {}, lines: {}}
            
            const tiles = []

            let index = 0
            for (const srcTile of state.game.field.tiles) {

                // copy each tile to avoid mutation of the global state
                const tile = Object.assign({}, srcTile)

                const {id, type} = tile
                
                if (type === "special") {
                    resultObj.special[id] = tile
                }
                else {
                    if (type === "tax") tile.price = tile.cost

                    tiles.push(tile)
                }
                
                const listColors = []
                for (const username of tile.players) {
                    listColors.push(state.game.players[username].color)
                }
                
                tile.index = index
                index++
                
                tile.players = listColors
            }

            resultObj.lines = {
                bottom: tiles.slice(0, 9),
                left: tiles.slice(9, 18),
                top: tiles.slice(18, 27),
                right: tiles.slice(27, 36)
            }

            return resultObj
        },

        cardHover() {
            const index = this.cardHoverIndex
            return (index != -1) ? state.game.field.tiles[index] : null
        },

        selectOwn() {
            const index = this.selectOwnIndex
            return (index != -1) ? state.game.field.tiles[index] : null
        }
    },

    methods: {
        showCard(tile) {
            if (!tile.canBuy) return
            this.cardHoverIndex = tile.index
        },

        hideCard() {
            this.cardHoverIndex = -1
        },

        clickOwn(tile) {
            this.selectOwnIndex = -1
            if (tile.owner) {
                this.selectOwnIndex = tile.index
            }
        },

        closeOwn() {
            this.selectOwnIndex = -1
        }
    },
    provide() {
        return {closeOwn: this.closeOwn}
    }
}
</script>

<style>
.field {
    width: 1440px;
    height: 1440px;

    background-color: #C3E8C6;

    position: relative;
}

#start {
    position: absolute;
    top: 1260px;
    left: 1260px;
}

#jail {
    position: absolute;
    top: 1260px;
    left: 0;
}

#parking {
    position: absolute;
    top: 0;
    left: 0;
}

#cops {
    position: absolute;
    top: 0;
    left: 1260px;
}

.line {
    display: flex;

    position: absolute;
}

.line_bottom {
    top: calc(1440px - 180px);
    left: 180px;
    flex-direction: row-reverse;
}

.line_left {
    transform: rotate(90deg);
    top: calc(50% - 90px);
    left: calc(-50% + 270px);

    flex-direction: row-reverse;
}

.line_top {
    top: 0;
    left: 180px;
}

.line_right {
    transform: rotate(-90deg);
    top: calc(50% - 90px);
    left: calc(1080px - 270px);

    flex-direction: row-reverse;
}

.logo {
    position: absolute;

    width: 1080px;
    height: 1080px;

    top: 180px;
    left: 180px;

    display: flex;
    align-items: center;
    justify-content: center;
}

.logo__title {
    padding: 10px 20px;
    background-color: rgb(187, 1, 1);
    border: black solid 2px;
    color: white;
    text-shadow: 2px 2px 0 black;

    font-size: 80px;
}

</style>
