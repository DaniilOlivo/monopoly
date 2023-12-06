<template>
    <div :class="['workspace', {'workspace_active': cardHover}]">
        <WindowComponent :modal="false">
            <template v-if="cardHover">
                <CardTileStandard v-if="cardHover.type == 'standard'" :tile="cardHover"></CardTileStandard>
                <CardTileCommunal v-else-if="cardHover.type == 'communal'" :tile="cardHover"></CardTileCommunal>
                <CardTileStation v-else-if="cardHover.type == 'station'" :tile="cardHover"></CardTileStation>
            </template>

        </WindowComponent>
    </div>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue';

import CardTileStandard from './cards/CardTileStandard.vue';
import CardTileStation from './cards/CardTileStation.vue';
import CardTileCommunal from './cards/CardTileCommunal.vue';

export default {
    name: "FieldWorkspace",
    components: {
        WindowComponent,
        CardTileStandard,
        CardTileStation,
        CardTileCommunal,
    },
    props: ["cardHover"],

}
</script>

<style scoped>
.workspace {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: none;
    justify-content: center;
    align-items: center;

    transition: 200ms;
}

.workspace_active {
    display: flex;
    background-color: rgba(30, 30, 30, 0.5);
}
</style>
