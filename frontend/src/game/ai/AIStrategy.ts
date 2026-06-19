import type { BoardState } from '../engine/types';
import type { GameRules } from '../engine/rules/GameRules';

export interface AIStrategy {
  readonly name: string;

  getBestMove(board: BoardState, aiPlayer: number, rules: GameRules, options?: AIOptions): [number, number] | null;
}

export interface AIOptions {
  depth?: number;
  [key: string]: any;
}
