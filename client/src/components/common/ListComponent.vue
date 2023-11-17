<template>
    <ul class="list">
        <li :class="['list__el', {'list__el_clickable': clickable}]"
            v-for="el in list" 
            :key="el.title" 
            @click="el.click">
            {{ el.title }}
        </li>
    </ul>
</template>

<script>
export default {
    name: "ListComponent",
    props: {
        title: String,
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
    },
    computed: {
        list() {
            if (this.clickable) return this.elements
            else {
                return this.elements.map(title => {
                    return {title}
                })
            }
        }
    }
}
</script>

<style scoped>

.list {
    list-style-type: none;
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

.list__el {
    padding: 0.8em 3em;
    text-align: center;
}

.list__el_clickable {
    cursor: pointer;
    transition: 200ms;
}

.list__el:nth-child(odd) {
    background-color: whitesmoke;
}

.list__el_clickable:hover {
    background-color: brown;
}
</style>
