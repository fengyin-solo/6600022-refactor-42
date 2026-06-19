import type { BoardState } from '../types';

export interface GameRules {
  readonly name: string;

  isValidMove(board: BoardState, row: number, col: number, player: number): boolean;

  checkWin(board: BoardState, row: number, col: number, player: number): boolean;

  isBoardFull(board: BoardState): boolean;

  evaluateBoard(board: BoardState, aiPlayer: number): number;

  getCandidateMoves(board: BoardState): [number, number][];
}
