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
</style>
