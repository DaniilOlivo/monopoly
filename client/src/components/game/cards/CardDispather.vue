<template>
    <component :is="dispathType" :tile="tile"></component>
</template>

<script>
import CardTileStandard from './CardTileStandard.vue'
import CardTileCommunal from './CardTileCommunal.vue'
import CardTileStation from './CardTileStation.vue'

export default {
    name: "CardDispather",
    props: {
        tile: Object
    },
    components: {
        CardTileStandard,
        CardTileCommunal,
        CardTileStation
    },
    computed: {
        dispathType() {
            let type = this.tile.type
            type = type[0].toUpperCase() + type.substring(1)
            return "CardTile" + type
        }
    }
}
</script>
