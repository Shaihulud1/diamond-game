import { createStore } from 'vuex';

interface PlayerState {
  currentGame: Record<string, any> | null;
  playerId: string | null
}

export default createStore({
  state: {
    currentGame: null, 
		playerId: null,
  },
  mutations: {
    setCurrentGame(state: PlayerState, game: Record<string, any>) {
      state.currentGame = game;
    },
    setPlayerId(state: PlayerState, id: string) {
      state.playerId = id;
    },
  },
  getters: {
    getPlayerId: (state: PlayerState) => {
      return state.playerId
    },
    getGame: (state: PlayerState) => {
      return state.currentGame
    }
  },
  actions: {},
});