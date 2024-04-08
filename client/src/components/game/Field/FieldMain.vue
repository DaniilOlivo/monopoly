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
                @click="clickTile(tile)" >
            </FieldTile>
        </div>

        <div class="logo">
            <h1 class="logo__title" @click="clickLogo">MONOPOLY</h1>
            <WorkspaceMain></WorkspaceMain>
        </div>
    </div>
</template>

<script>
import FieldTile from './FieldTile.vue';
import WorkspaceMain from '../Workspace/WorkspaceMain.vue';

import { mapState, mapMutations, mapActions, mapGetters } from "vuex"

export default {
    name: "FieldMain",
    components: {
        FieldTile,
        WorkspaceMain
    },
    data() {
        return {
            countClickLogo: 0
        }
    },
    computed: {
        ...mapState([
            "game",
            "consoleDevOpen"
        ]),

        ...mapGetters("deal", ["activeDeal"]),

        tiles() {
            const { field, players } = this.game

            const resultObj = {special: {}, lines: {}}
            
            const tiles = []

            let index = 0
            for (const srcTile of field.tiles) {

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
                    listColors.push(players[username].color)
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
        }
    },

    methods: {
        ...mapMutations(["setConsole"]),

        ...mapMutations("workspace", [
            "hover",
            "select",
            "unhover"
        ]),

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
        },

        clickLogo() {
            this.countClickLogo++
            if (this.countClickLogo >= 5 && !this.consoleDevOpen) {
                this.countClickLogo = 0
                this.setConsole(true)
            } 
        }
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
