<template>
    <div class="field">
        <FieldTile
            v-for="tile in tiles"
            :tile="tile"
            :key="tile.index"
            @mouseenter="showCard(tile)"
            @mouseleave="hideCard()"
            @click="clickTile(tile)">
        </FieldTile>

        <div class="logo">
            <h1 class="logo__title">MONOPOLY</h1>
            <slot></slot>
        </div>

        <!-- Chip necessary for animation of movement -->
        <PlayerChip
            v-if="absoluteChip"
            username=""
            :color="absoluteChip.color"
            :arrested="false"
            :absolute="true"
            :pos="absoluteChip.pos">
        </PlayerChip>
    </div>
</template>

<script>
import FieldTile from './FieldTile.vue';
import PlayerChip from './PlayerChip.vue';

import { mapState, mapMutations, mapActions, mapGetters } from "vuex"

export default {
    name: "FieldMain",
    components: {
        FieldTile,
        PlayerChip
    },
    data() {
        return {
            absoluteChip: null
        }
    },
    computed: {
        ...mapState(["game"]),

        ...mapState("field", ["color", "startPos", "endPos"]),
        ...mapGetters("field", ["readyMove"]),

        ...mapGetters("deal", ["activeDeal"]),

        tiles() {
            const { field, players } = this.game
            
            // A preliminary array with copies of tiles from the core game
            // Copies are slightly modified and numbered
            // This is necessary because in the Grid the tiles will be located differently
            const preTiles = []

            let index = 0
            for (const srcTile of field.tiles) {

                // copy each tile to avoid mutation of the global state
                const tile = Object.assign({}, srcTile)

                if (tile.type === "tax") tile.price = tile.cost
                
                const playersData = []
                for (const username of tile.players) {
                    const {color, arrested} = players[username]
                    playersData.push({
                        username,
                        color,
                        arrested
                    })
                }
                tile.players = playersData

                tile.index = index
                index++

                // Set the default tile orientation. The default is horizontal, like in the original game
                tile.orientation = "horizontal"
                
                preTiles.push(tile)
            }

            // Tiles sorted from the top left corner of the field
            const sortTiles = []

            // Top row
            for (let i = 20; i <= 30; i++) {
                sortTiles.push(preTiles[i])
            }

            // Left and right column
            for (let i = 19; i > 10; i--) {
                const leftTile = preTiles[i]
                leftTile.orientation = "vertical"
                sortTiles.push(leftTile)

                const rightTile = preTiles[50 - i]
                rightTile.orientation = "vertical"
                sortTiles.push(rightTile)
            }

            // Bottom row
            for (let i = 10; i >= 0; i--) {
                sortTiles.push(preTiles[i])
            }

            return sortTiles
        }
    },

    watch: {
        readyMove(newVal) {
            if (!newVal) return

            this.absoluteChip = {
                color: this.color,
                pos: this.startPos
            }

            setTimeout(() => {
                this.absoluteChip.pos = this.endPos
                setTimeout(() => {
                    this.absoluteChip = null
                    this.clear()
                }, 600)
            }, 200)
        }
    },

    methods: {
        ...mapMutations("workspace", [
            "hover",
            "select",
            "unhover"
        ]),

        ...mapMutations("field", ["clear"]),

        ...mapActions("deal", ["addTile"]),

        showCard(tile) {
            if (!tile.canBuy) return
            this.hover(tile.index)
        },

        hideCard() {
            this.unhover()
        },

        clickTile(tile) {
            this.unhover()
            const { id, owner } = tile

            if (owner) {
                if (this.activeDeal) this.addTile({id, owner})
                else this.select(tile.index)
            }
        }
    }
}
</script>

<style>
.field {
    width: 75vw;
    height: 100vh;

    display: grid;
    grid-template-columns: 3fr repeat(9, 2fr) 3fr;
    grid-template-rows: 3fr repeat(9, 2fr) 3fr;

    background-color: #C3E8C6;

    position: relative;
}

.logo {
    grid-row: 2 / 11;
    grid-column: 2 / 11;

    position: relative;

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
