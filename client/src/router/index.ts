import { createRouter, createWebHistory } from 'vue-router'
import GameView from '@/views/GameView.vue';
import GamePlay from '@/views/GamePlay.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'gameView',
      component: GameView
    },
    {
      path: '/game/:gameId',
      name: 'gamePlay',
      component: GamePlay,
      props: true,
    },
  ]
})

export default router
