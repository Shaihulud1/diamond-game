import { generateBoard } from './utils';

export class Game {
  private players: string[] = [];
  private currentPlayerIndex = 0; // TODO: выбирать в случайном порядке
  private scores: Map<string, number> = new Map();

  private status: GameStatus = GameStatus.Created;
  private board: Board | undefined = undefined;

  constructor(
    public id: string,
    private fieldSize: number,
    private diamonds: number,
  ) {}

  getPlayers() {
    return this.players;
  }

  pickCell(yIndex: number, xIndex: number) {
    this.getCell(yIndex, xIndex);
    const board = this.board as Board;
    board[yIndex][xIndex].isPicked = true;
  }

  joinPlayer(player: string) {
    if (this.isGameFull()) {
      throw new Error(`Game already full`);
    }
    const index = this.players[0] ? 1 : 0;
    this.players[index] = player;
  }

  startGame() {
    if (!this.isGameFull()) {
      throw new Error('Have to join more players for start game');
    }
    if (this.status === GameStatus.Started) {
      throw new Error('Game already started');
    }
    if (!this.fieldSize || this.fieldSize < 0) {
      throw new Error(`Have to set field size first`);
    }
    if (!this.diamonds || this.diamonds < 0) {
      throw new Error(`Diamonds have to set diamonds number first`);
    }
    this.board = generateBoard(this.fieldSize, this.diamonds);
    this.status = GameStatus.Started;
  }

  toClient(): ClientGame {
    if (this.status === GameStatus.Started) {
      return {
        id: this.id,
        players: this.players,
        status: this.status,
        board: this.getClientBoard() as BoardClient,
        whoMove: this.getPlayerWhoMove(),
        playersScore: {
          [this.players[0]]: this.getPlayerScore(this.players[0]),
          [this.players[1]]: this.getPlayerScore(this.players[1]),
        },
      };
    } else {
      return {
        id: this.id,
        players: this.players,
        status: this.status,
      };
    }
  }

  isGameFull() {
    return this.players.length >= 2;
  }

  getPlayerScore(player: string) {
    return this.scores.get(player) ?? 0;
  }

  incPlayerScore(player: string) {
    const scoreb4 = this.getPlayerScore(player);
    this.scores.set(player, scoreb4 + 1);
  }

  getWinnerIfHave() {
    const score1 = this.getPlayerScore(this.players[0]);
    const score2 = this.getPlayerScore(this.players[1]);

    const playersScore = score1 + score2;
    if (playersScore >= this.diamonds) {
      return score1 > score2 ? this.players[0] : this.players[1];
    }
  }

  getPlayerWhoMove() {
    return this.players[this.currentPlayerIndex];
  }

  nextTurn() {
    this.currentPlayerIndex = this.currentPlayerIndex >= 1 ? 0 : 1;
  }

  getCell(yIndex: number, xIndex: number) {
    if (!this.board) {
      throw new Error('Board is not generated');
    }
    const cell = this.board[yIndex][xIndex];
    if (!cell) {
      throw new Error(`Unknown cell`);
    }
    return cell;
  }

  getStatus() {
    return this.status;
  }

  private getClientBoard(): BoardClient | undefined {
    if (!this.board) {
      return undefined;
    }
    const clientBoard: BoardClient = [];

    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i];

      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        const clientCell: CellClient = {
          content: cell.isPicked ? cell.content : CellContent.Hidden,
          diamondsAround: cell.isPicked ? cell.diamondsAround : undefined,
        };
        if (!clientBoard[i]) {
          clientBoard[i] = [];
        }
        clientBoard[i][j] = clientCell;
      }
    }

    return clientBoard;
  }
}

export type ClientGame =
  | {
      id: string;
      players: string[];
      status: GameStatus.Created;
    }
  | {
      id: string;
      players: string[];
      status: GameStatus.Started;
      board: BoardClient;
      whoMove: string;
      playersScore: Record<string, number>;
    };

export enum GameStatus {
  Created,
  Started,
}

export type Board = Cell[][];

export enum CellContent {
  Number,
  Diamond,
  Hidden,
}

export type Cell = {
  content: CellContent;
  diamondsAround: number;
  isPicked: boolean;
};

export type BoardClient = CellClient[][];

export type CellClient = {
  content: CellContent;
  diamondsAround?: number;
};
