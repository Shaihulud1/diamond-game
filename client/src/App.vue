<template>
  <header>

  </header>
  <h1>Player ID: {{ playerId }}</h1>
  <p style="color:red;">{{ error }}</p>
  <RouterView />
</template>

<script setup>
import { computed, ref } from 'vue';
import playerStore from './store/playerStore';
import { useWebsocket } from './socket/gameSocket';
import { useRouter } from 'vue-router';

const { socket } = useWebsocket()

const playerId = computed(() => playerStore.state.playerId);

const error = ref('')

const router = useRouter()

socket.on('error', (message) => {
  error.value = message
})
socket.on('connect', () => {
  playerStore.commit('setPlayerId', socket.id);
  playerStore.commit('setCurrentGame', null);
})
socket.on('disconnect', () => {
  playerStore.commit('setPlayerId', socket.id);
  playerStore.commit('setCurrentGame', null);
  router.push({ name: 'gameView' });
});

socket.on('exception', (data) => {
  alert(data.message ?? 'Server error')
})
</script>
