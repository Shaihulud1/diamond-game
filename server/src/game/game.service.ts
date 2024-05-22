import { Injectable } from '@nestjs/common';
import { CellContent, ClientGame, Game } from './game.entity';
import { GameStore } from './game.store';
import { CreateGameDTO } from './dto/create-game.dto';
import { JoinGameDTO } from './dto/join-game.dto';
import { MakeMoveDTO } from './dto/make-move.dto';

@Injectable()
export class GameService {
  constructor(private readonly gameStore: GameStore) {}

  getAvailableGames(): ClientGame[] {
    return this.gameStore.getCreatedGames().map((g) => g.toClient());
  }

  createGame(createGameDto: CreateGameDTO): ClientGame {
    if (
      createGameDto.fieldSize * createGameDto.fieldSize <
      createGameDto.diamonds
    ) {
      throw new Error(`FieldSize is too small`);
    }
    if (createGameDto.diamonds % 2 === 0) {
      throw new Error('Diamonds must not be even');
    }
    const id = (Math.random() + 1).toString(36).substring(7);
    const game = new Game(id, createGameDto.fieldSize, createGameDto.diamonds);
    this.gameStore.setGame(id, game);

    return game.toClient();
  }

  joinGame(player: string, joinGameDTO: JoinGameDTO): ClientGame {
    const game = this.gameStore.getGame(joinGameDTO.gameId);

    game.joinPlayer(player);
    this.gameStore.setPlayerGame(player, game.id);

    return game.toClient();
  }

  remGame(player: string): string | undefined {
    const gameId = this.gameStore.getPlayerGame(player);
    if (gameId) {
      const game = this.gameStore.getGame(gameId);
      const players = game.getPlayers();
      players.forEach((p) => this.gameStore.remPlayerGame(p));
      this.gameStore.remGame(gameId);
    }

    return gameId;
  }

  canStartGame(gameId: string): boolean {
    const game = this.gameStore.getGame(gameId);
    return game.isGameFull();
  }

  startGame(gameId: string): ClientGame {
    const game = this.gameStore.getGame(gameId);
    game.startGame();
    return game.toClient();
  }

  makeMove(
    player: string,
    makeMoveDTO: MakeMoveDTO,
  ): {
    winner: string | undefined;
    game: ClientGame;
  } {
    const gameId = this.gameStore.getPlayerGame(player);
    if (!gameId) {
      throw new Error(`Player don't have game`);
    }
    const game = this.gameStore.getGame(gameId);
    if (game.getPlayerWhoMove() !== player) {
      throw new Error(`Not move of this player`);
    }
    const choosenCell = game.getCell(makeMoveDTO.cellY, makeMoveDTO.cellX);
    if (choosenCell.isPicked) {
      throw new Error(`Cell is already picked`);
    }
    if (choosenCell.content === CellContent.Diamond) {
      game.incPlayerScore(player);
    } else {
      game.nextTurn();
    }
    game.pickCell(makeMoveDTO.cellY, makeMoveDTO.cellX);

    return {
      winner: game.getWinnerIfHave(),
      game: game.toClient(),
    };
  }

  finishGame(gameId: string): void {
    this.gameStore.remGame(gameId);
  }
}
