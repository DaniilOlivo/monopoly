<template>
    <div class="bg">
        <div class="window">
            <h2 class="window__title" v-if="title">{{ title }}</h2>
            <slot></slot>

            <div class="panel-btns">
                <slot name="btns"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "WindowComponent",
    props: {
        title: String
    }
}
</script>

<style scoped>
.bg {
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
    max-width: 500px;

    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
}

.window__title {
    margin: 0;
}

.panel-btns {
    display: flex;
    justify-content: center;
    gap: 30px;
}
</style>
