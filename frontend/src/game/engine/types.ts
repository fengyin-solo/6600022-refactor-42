export const BOARD_SIZE = 15;
export const EMPTY = 0;
export const BLACK = 1;
export const WHITE = 2;

export type BoardState = number[][];

export interface Move {
  row: number;
  col: number;
  player: number;
  timestamp: number;
}

export interface GameRecord {
  id: string;
  moves: Move[];
  winner: number | null;
  createdAt: string;
  duration: number;
}

export type GameStatus = 'idle' | 'playing' | 'finished' | 'replaying';

export const DIRECTIONS = [[0, 1], [1, 0], [1, 1], [1, -1]];

export function createEmptyBoard(): BoardState {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY));
}

export function cloneBoard(board: BoardState): BoardState {
  return board.map(row => [...row]);
}

export function inBounds(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}
