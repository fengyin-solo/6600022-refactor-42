import type { BoardState, Move } from './types';
import { createEmptyBoard, cloneBoard, BLACK } from './types';
import type { GameRules } from './rules/GameRules';
import { StandardGomokuRules } from './rules/StandardGomokuRules';

export class GameEngine {
  private _board: BoardState;
  private _currentPlayer: number;
  private _moves: Move[];
  private _winner: number | null;
  private _rules: GameRules;

  constructor(rules?: GameRules) {
    this._rules = rules || new StandardGomokuRules();
    this._board = createEmptyBoard();
    this._currentPlayer = BLACK;
    this._moves = [];
    this._winner = null;
  }

  get board(): BoardState {
    return this._board;
  }

  get currentPlayer(): number {
    return this._currentPlayer;
  }

  get moves(): Move[] {
    return [...this._moves];
  }

  get winner(): number | null {
    return this._winner;
  }

  get rules(): GameRules {
    return this._rules;
  }

  get isGameOver(): boolean {
    return this._winner !== null;
  }

  get moveCount(): number {
    return this._moves.length;
  }

  reset(): void {
    this._board = createEmptyBoard();
    this._currentPlayer = BLACK;
    this._moves = [];
    this._winner = null;
  }

  placeStone(row: number, col: number): boolean {
    if (this._winner !== null) return false;
    if (!this._rules.isValidMove(this._board, row, col, this._currentPlayer)) return false;

    this._board[row][col] = this._currentPlayer;
    const move: Move = { row, col, player: this._currentPlayer, timestamp: Date.now() };
    this._moves.push(move);

    if (this._rules.checkWin(this._board, row, col, this._currentPlayer)) {
      this._winner = this._currentPlayer;
      return true;
    }

    if (this._rules.isBoardFull(this._board)) {
      this._winner = 0;
      return true;
    }

    this._currentPlayer = this._currentPlayer === 1 ? 2 : 1;
    return true;
  }

  checkWinAt(row: number, col: number): boolean {
    if (this._board[row][col] === 0) return false;
    return this._rules.checkWin(this._board, row, col, this._board[row][col]);
  }

  setRules(rules: GameRules): void {
    this._rules = rules;
  }

  clone(): GameEngine {
    const engine = new GameEngine(this._rules);
    engine._board = cloneBoard(this._board);
    engine._currentPlayer = this._currentPlayer;
    engine._moves = [...this._moves];
    engine._winner = this._winner;
    return engine;
  }
}
