<template>
    <div :class="['bg', {'bg_fullscreen': fullscreen}]">
        <div class="window">
            <img :src="imgExitCross" v-if="exitCross.active" @click="exitCross.handler" class="exit-cross">

            <h2 class="window__title" v-if="title">{{ title }}</h2>
            <slot></slot>

            <div class="panel-btns">
                <slot name="btns"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import imgExitCross from "./img/exitCross.png"

export default {
    name: "WindowComponent",
    props: {
        title: String,
        fullscreen: {
            type: Boolean,
            default: false
        },
        exitCross: {
            type: Object,
            default() {
                return {
                    active: false,
                    handler: () => {}
                }
            }
        },
    },
    data() {
        return {
            imgExitCross
        }
    }
}
</script>

<style scoped>
.bg_fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: aliceblue;
}

.window {
    border-radius: 10px;
    background-color: white;
    padding: 30px 50px;

    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;

    position: relative;
}

.window__title {
    margin: 0;
}

.panel-btns {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
}

.exit-cross {
    position: absolute;

    top: 5px;
    right: 5px;
}
</style>
