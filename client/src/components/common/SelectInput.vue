<template>
    <div class="select" @mouseleave="leaveMouse">
        <div 
            :class="['select-el', 'select__selected', {'select__selected_avtive': enableList}]"
            @click="clickSelected">
            {{ labelValue }}
        </div>
        
        <div :class="['select-list', {'select-list_open': enableList}]">
            <div
                class="select-el select-list__option"
                v-for="(value, label) in mapValues"
                :key="value"
                @click="$emit('update:modelValue', value)">{{ label }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SelectInput",

    props: {
        modelValue: String,
        arrValues: Array,
        arrLabels: Array
    },

    data() {
        return {
            enableList: false
        }
    },

    computed: {
        mapValues() {
            const mapValues = {}
            for (let i = 0; i < this.arrValues.length; i++) {
                const value = this.arrValues[i]
                const key = this.arrLabels[i] ?? value
                mapValues[key] = value
            }
            return mapValues
        },

        labelValue() {
            for (const [label, value] of Object.entries(this.mapValues)) {
                if (value == this.modelValue) return label
            }
            return "-"
        }
    },

    methods: {
        clickSelected() {
            this.enableList = !this.enableList
        },

        leaveMouse() {
            this.enableList = false
        },

        clickOption(newValue) {
            this.$emit("input", newValue)
        }
    }
}
</script>

<style scoped>
.select {
    position: relative;
    cursor: pointer;
}

.select-el {
    padding: 0.3em 1em;
    transition: 200ms;
}

.select-el:hover {
    background-color: brown;
    color: white;
}

.select__selected {
    border-radius: 10px;
    background-color: white;
    box-shadow: 0px 5px 6px 2px rgba(34, 60, 80, 0.2);
}

.select__selected_avtive {
    border-radius: 0 0 10px 10px;
    background-color: brown;
    color: white;
}

.select-list {
    display: none;
    position: absolute;
    bottom: 100%;

    background-color: white;
}

.select-list_open {
    display: block;
}
</style>
