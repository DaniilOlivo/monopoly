<template>
    <WindowComponent :fullscreen="true" :title="$t('other.oops')">
        <div class="oops-window">
            <h1 class="oops-window__emotion">:(</h1>
            <p class="oops-window__message">
                {{ message }}
            </p>
        </div>
    </WindowComponent>
</template>

<script>
import WindowComponent from '@/components/common/WindowComponent.vue'

export default {
    name: "OopsWindow",
    components: {
        WindowComponent
    },
    props: {
        message: String,
    }
}
</script>

<style scoped>
.oops-window {
    display: flex;
}

.oops-window__emotion {
    font-size: 60px;
}
</style>
