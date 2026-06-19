import type { BoardState } from '../engine/types';
import { EMPTY } from '../engine/types';
import type { GameRules } from '../engine/rules/GameRules';
import type { AIStrategy, AIOptions } from './AIStrategy';

const FIVE_SCORE = 1000000;

export class MinimaxAIStrategy implements AIStrategy {
  readonly name = 'minimax-alpha-beta';

  getBestMove(board: BoardState, aiPlayer: number, rules: GameRules, options: AIOptions = {}): [number, number] | null {
    const depth = options.depth ?? 3;
    const candidates = rules.getCandidateMoves(board);
    if (candidates.length === 0) return null;

    let bestMove: [number, number] = candidates[0];
    let bestScore = -Infinity;

    for (const [r, c] of candidates) {
      board[r][c] = aiPlayer;
      if (rules.checkWin(board, r, c, aiPlayer)) {
        board[r][c] = EMPTY;
        return [r, c];
      }
      const score = this.minimax(board, depth - 1, -Infinity, Infinity, false, aiPlayer, rules);
      board[r][c] = EMPTY;
      if (score > bestScore) {
        bestScore = score;
        bestMove = [r, c];
      }
    }
    return bestMove;
  }

  private minimax(
    board: BoardState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean,
    aiPlayer: number,
    rules: GameRules
  ): number {
    const humanPlayer = aiPlayer === 1 ? 2 : 1;

    if (depth === 0) return rules.evaluateBoard(board, aiPlayer);

    const candidates = rules.getCandidateMoves(board);
    if (candidates.length === 0) return rules.evaluateBoard(board, aiPlayer);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const [r, c] of candidates) {
        board[r][c] = aiPlayer;
        if (rules.checkWin(board, r, c, aiPlayer)) {
          board[r][c] = EMPTY;
          return FIVE_SCORE * (depth + 1);
        }
        const eval_ = this.minimax(board, depth - 1, alpha, beta, false, aiPlayer, rules);
        board[r][c] = EMPTY;
        maxEval = Math.max(maxEval, eval_);
        alpha = Math.max(alpha, eval_);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const [r, c] of candidates) {
        board[r][c] = humanPlayer;
        if (rules.checkWin(board, r, c, humanPlayer)) {
          board[r][c] = EMPTY;
          return -FIVE_SCORE * (depth + 1);
        }
        const eval_ = this.minimax(board, depth - 1, alpha, beta, true, aiPlayer, rules);
        board[r][c] = EMPTY;
        minEval = Math.min(minEval, eval_);
        beta = Math.min(beta, eval_);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }
}
