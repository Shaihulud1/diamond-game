<template>
	<h1>Game: {{ gameId }}</h1>
	<div class="scores">
		<p>Your score: {{ yourScore }}</p>
		<p>Your opponent's score: {{ opponentScore }}</p>
		<p v-if="isGameOver">Game over</p>
	</div>
	<p class="turn">{{ isYourTurn ? 'Your turn' : "Opponent's turn" }}</p>
	<div class="game-container">
		<!-- <div v-if="gameStart" class="board"> -->
		<div class="board">
			<div class="row" v-for="(row, rowIndex) in board" :key="`row-${rowIndex}`">
				<div class="cell" v-for="(cell, cellIndex) in row" :key="`cell-${cellIndex}`"
					@click="clickCell(cell, rowIndex, cellIndex)" :class="getCellClass(cell)">
					<template v-if="cell.content !== 2">{{ getCellContent(cell) }}</template>
				</div>
			</div>
		</div>
		<!-- <div v-else>
			waiting for players
		</div> -->
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useWebsocket } from './../socket/gameSocket'; // Обновите путь импорта
import { useRoute } from 'vue-router';
import playerStore from './../store/playerStore';

const route = useRoute();
const { socket } = useWebsocket();
const gameStart = ref(false);
const board = ref([]);
const gameId = ref('');

const playerId = computed(() => playerStore.getters.getPlayerId);
const game = computed(() => playerStore.getters.getGame);
const yourScore = ref(0)
const opponentScore = ref(0)
const isYourTurn = ref(false);
const isGameOver = ref(false);

const clickCell = (_cell, rowIndex, cellIndex) => {
	if (isGameOver.value) {
		return
	}
	if (playerId.value !== game.value.whoMove) {
		alert('Now is not your turn')
		return
	}
	socket.emit('makeMove', {
		cellY: rowIndex,
		cellX: cellIndex
	})
};

const getCellClass = (cell) => {
	switch (cell.content) {
		case 2: return 'hidden';
		case 1: return 'diamond';
		default: return '';
	}
};

const getCellContent = (cell) => {
	return cell.content === 0 ? cell.diamondsAround.toString() : '';
};

const gameMove = (game) => {
	console.log(game)
	const players = {
		you: playerId.value,
		opponent: game.players[0] !== playerId.value ? game.players[0] : game.players[1]
	}
	gameStart.value = true;
	yourScore.value = game.playersScore[players['you']]
	opponentScore.value = game.playersScore[players['opponent']]
	isYourTurn.value = game.whoMove === players['you']
	console.log(game.whoMove, players, 'debug')
	board.value = game.board; // Здесь предполагается, что сервер отправляет текущее состояние игровой доски
	playerStore.commit('setCurrentGame', game);
}

socket.on('gameStart', (data) => {
	gameMove(data.game)
});

socket.on('moveResult', (data) => {
	gameMove(data.game)
})

socket.on('gameWinner', (data) => {
	isGameOver.value = true
	gameMove(data.game)
	setTimeout(() => {
		if (data.playerWin === playerId.value) {
			alert('You win')
		} else {
			alert('You lose');
		}
		socket.disconnect()
	}, "1500");
})

onMounted(async () => {
	gameId.value = route.params.gameId;
	socket.emit('joinGame', { gameId: gameId.value }); // Подключение к игре с заданным gameId
});
</script>

<style>
.board {
	display: flex;
	flex-direction: column;
}

.row {
	display: flex;
}

.cell {
	width: 50px;
	height: 50px;
	border: 1px solid #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.cell.hidden {
	background-color: #9e9e9e;
	/* Серый цвет скрытых клеток */
}

.cell.diamond::before {
	content: "💎";
	/* Символ алмаза для клеток с алмазом */
}

.cell.highlight:hover {
	background-color: #e3e3e3;
	/* выберите цвет который вам подходит */
	cursor: pointer;
}
</style>