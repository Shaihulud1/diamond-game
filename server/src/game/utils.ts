import { Board, Cell, CellContent } from './game.entity';

export function generateBoard(fieldSize: number, diamonds: number): Board {
  const board = Array.from({ length: fieldSize }, () =>
    Array.from(
      { length: fieldSize },
      (): Cell => ({
        content: CellContent.Number,
        diamondsAround: 0,
        isPicked: false,
      }),
    ),
  );

  // распределение алмазов по полю
  let placedDiamonds = 0;
  while (placedDiamonds < diamonds) {
    const x = Math.floor(Math.random() * fieldSize);
    const y = Math.floor(Math.random() * fieldSize);

    if (board[y][x].content === CellContent.Number) {
      board[y][x].content = CellContent.Diamond;

      // увеличиваем счетчик алмазов вокруг для соседних клеток
      incrementDiamondsAround(board, x, y, fieldSize);
      placedDiamonds++;
    }
  }

  return board;
}

function incrementDiamondsAround(
  board: Board,
  x: number,
  y: number,
  fieldSize: number,
): void {
  for (let i = Math.max(y - 1, 0); i <= Math.min(y + 1, fieldSize - 1); i++) {
    for (let j = Math.max(x - 1, 0); j <= Math.min(x + 1, fieldSize - 1); j++) {
      // Увеличиваем счетчик, если клетка не содержит алмаз
      if (board[i][j].content !== CellContent.Diamond) {
        board[i][j].diamondsAround++;
      }
    }
  }
}
