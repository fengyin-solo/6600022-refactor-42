import type { BoardState, Move, GameRecord } from '../engine/types';
import { createEmptyBoard, EMPTY } from '../engine/types';

export interface ReplayState {
  board: BoardState;
  index: number;
  isPlaying: boolean;
  speed: number;
}

export type ReplayCallback = (state: ReplayState) => void;

export class ReplayManager {
  private _moves: Move[] = [];
  private _index: number = 0;
  private _board: BoardState = createEmptyBoard();
  private _speed: number = 1000;
  private _isPlaying: boolean = false;
  private _timer: ReturnType<typeof setInterval> | null = null;
  private _onChange: ReplayCallback | null = null;

  get moves(): Move[] {
    return [...this._moves];
  }

  get index(): number {
    return this._index;
  }

  get board(): BoardState {
    return this._board;
  }

  get speed(): number {
    return this._speed;
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  get totalMoves(): number {
    return this._moves.length;
  }

  get isAtEnd(): boolean {
    return this._index >= this._moves.length;
  }

  get isAtStart(): boolean {
    return this._index === 0;
  }

  setOnChange(callback: ReplayCallback | null): void {
    this._onChange = callback;
  }

  loadRecord(record: GameRecord): void {
    this.stop();
    this._moves = [...record.moves];
    this._index = 0;
    this._board = createEmptyBoard();
    this.notifyChange();
  }

  stepForward(): void {
    if (this._index >= this._moves.length) return;
    const move = this._moves[this._index];
    this._board[move.row][move.col] = move.player;
    this._index++;
    this.notifyChange();
  }

  stepBack(): void {
    if (this._index <= 0) return;
    this._index--;
    const move = this._moves[this._index];
    this._board[move.row][move.col] = EMPTY;
    this.notifyChange();
  }

  goToStart(): void {
    this._board = createEmptyBoard();
    this._index = 0;
    this.notifyChange();
  }

  goToEnd(): void {
    this._board = createEmptyBoard();
    for (let i = 0; i < this._moves.length; i++) {
      const m = this._moves[i];
      this._board[m.row][m.col] = m.player;
    }
    this._index = this._moves.length;
    this.notifyChange();
  }

  goToStep(targetIndex: number): void {
    if (targetIndex < 0 || targetIndex > this._moves.length) return;
    this._board = createEmptyBoard();
    for (let i = 0; i < targetIndex; i++) {
      const m = this._moves[i];
      this._board[m.row][m.col] = m.player;
    }
    this._index = targetIndex;
    this.notifyChange();
  }

  play(): void {
    if (this._isPlaying) return;
    if (this._index >= this._moves.length) return;

    this._isPlaying = true;
    this._timer = setInterval(() => {
      if (this._index >= this._moves.length) {
        this.stop();
        return;
      }
      this.stepForward();
    }, this._speed);
    this.notifyChange();
  }

  pause(): void {
    if (!this._isPlaying) return;
    this._isPlaying = false;
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
    this.notifyChange();
  }

  stop(): void {
    const wasPlaying = this._isPlaying;
    this.pause();
    if (!wasPlaying) this.notifyChange();
  }

  togglePlay(): void {
    if (this._isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setSpeed(ms: number): void {
    this._speed = ms;
    if (this._isPlaying) {
      this.pause();
      this.play();
    } else {
      this.notifyChange();
    }
  }

  reset(): void {
    this.stop();
    this._moves = [];
    this._index = 0;
    this._board = createEmptyBoard();
    this.notifyChange();
  }

  private notifyChange(): void {
    if (this._onChange) {
      this._onChange({
        board: this._board,
        index: this._index,
        isPlaying: this._isPlaying,
        speed: this._speed,
      });
    }
  }

  destroy(): void {
    this.stop();
    this._onChange = null;
  }
}
