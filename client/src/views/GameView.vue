<template>
  <div>
    <h1>Create Game</h1>
    <form @submit.prevent="handleSubmit">
      <label for="fieldSize">Field Size:</label>
      <input type="number" id="fieldSize" v-model.number="fieldSize" />

      <label for="diamonds">Diamonds:</label>
      <input type="number" id="diamonds" v-model.number="diamonds" />

      <button type="submit">Create Game</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter()

const fieldSize = ref(5);
const diamonds = ref(3);

const createNewGame = async (fieldSize, diamonds) => {
  const apiClient = axios.create({
    baseURL: 'http://localhost:3000', // URL вашего API
    // Тут можно добавить другие настройки, например, заголовки по умолчанию
  });
  try {
    const params = {
      fieldSize,
      diamonds,
    }
    const response = await apiClient.post('/games/create-game', params);
    return response.data; // Возвращает данные новой игры
  } catch (error) {
    // Обработка ошибок запроса
    alert(error.message ?? 'Ошибка')
    throw error;
  }
};

const handleSubmit = async () => {
  try {
    const data = await createNewGame(fieldSize.value, diamonds.value);
    router.push({ name: 'gamePlay', params: { gameId: data.id } });
  } catch (error) {
    alert(error.response.data.message)
  }
};
</script>

<style></style>