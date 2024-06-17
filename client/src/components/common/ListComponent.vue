<template>
    <div class="list">
        <div
            v-for="(el, index) in elements"
            :key="index"
            :class="['list-line', {'list-line_clickable': clickable, 'list-line_center': !el.detail}]"
            @click="el.click">
            <span>{{ el.label }}</span>
            <span v-if="el.detail">{{ el.detail }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: "ListComponent",
    props: {
        elements: {
            type: Array,
            default: function() {
                return []
            }
        },
        clickable: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style scoped>
.list {
    padding: 0px;
    position: relative;
    min-width: 200px;
    min-height: 100px;
    margin: 0;
}

.list::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
    box-shadow: 0px 5px 10px 2px rgba(34, 60, 80, 0.2) inset;
    pointer-events: none;
}

.list-line {
    display: flex;
    justify-content: space-between;
    padding: 0.5em 1em;
}

.list-line_clickable {
    cursor: pointer;
    transition: 200ms;
}

.list-line_center {
    justify-content: center;
}

.list-line:nth-child(odd) {
    background-color: whitesmoke;
}

.list-line_clickable:hover {
    background-color: brown;
}
</style>
