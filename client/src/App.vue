<template>
  <router-view/>
</template>

<script>
import { createRoom, getListRooms } from "./api/menu"

export default {
  name: "App",
  provide: {
    createRoom,
    getListRooms
  }
}
</script>

<style>
#app {
  font-size: 18px;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.input-line {
    display: flex;
    gap: 1em;
}

input {
    border: brown 2px solid;
    border-radius: 5px;
    padding: 0.5em 1em;
    transition: 200ms;
}

.warning {
    color: brown;
}
</style>
