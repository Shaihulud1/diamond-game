import { Game, GameStatus } from './game.entity';

export class GameStore {
  private readonly games: Map<string, Game> = new Map();

  private readonly playersToGames: Map<string, string> = new Map();

  setGame(gameId: string, game: Game): void {
    if (this.games.has(gameId)) {
      throw new Error(`Already has game with id ${gameId}`);
    }
    this.games.set(gameId, game);
  }

  getGame(gameId: string): Game {
    if (!this.games.has(gameId)) {
      throw new Error(`Unknown game ${gameId}`);
    }
    return this.games.get(gameId) as Game;
  }

  remGame(gameId: string): void {
    if (this.games.has(gameId)) this.games.delete(gameId);
  }

  setPlayerGame(playerId: string, gameId: string): void {
    this.playersToGames.set(playerId, gameId);
  }

  getPlayerGame(playerId: string): string | undefined {
    return this.playersToGames.get(playerId);
  }

  remPlayerGame(playerId: string): void {
    if (this.playersToGames.has(playerId)) this.playersToGames.delete(playerId);
  }

  getCreatedGames(): Game[] {
    return Array.from(this.games)
      .map(([, value]) => value)
      .filter((g) => g.getStatus() === GameStatus.Created);
  }
}
