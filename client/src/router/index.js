import { createRouter, createWebHistory } from 'vue-router'
import MenuStart from "../views/MenuStart.vue"
import ListRooms from "../views/ListRooms.vue"
import CreateRoom from "../views/CreateRoom.vue"

const routes = [
  {
    path: '/',
    name: 'startMenu',
    component: MenuStart
  },

  {
    path: '/list',
    name: "list",
    component: ListRooms,
  },

  {
    path: '/create',
    name: 'create',
    component: CreateRoom
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
