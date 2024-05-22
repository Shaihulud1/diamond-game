import { onMounted } from 'vue';
import io from 'socket.io-client';

const socket = io('ws://localhost:3000/game', { autoConnect: false });

export function useWebsocket() {
  const connectSocket = () => {
    if (!socket.connected) {
      socket.connect();
    }
  };
  onMounted(async () => {
    connectSocket()
  });

  const joinGame = (gameId: string) => {
    socket.emit('joinGame', {
      gameId
    })
  } 

  return {
    socket,
    joinGame,
  };
}