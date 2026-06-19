import type { BoardState } from '../types';
import { BOARD_SIZE, EMPTY, DIRECTIONS, inBounds } from '../types';
import type { GameRules } from './GameRules';

const SCORE_TABLE: Record<string, number> = {
  'five': 1000000,
  'live-four': 100000,
  'dead-four': 10000,
  'live-three': 10000,
  'dead-three': 1000,
  'live-two': 1000,
  'dead-two': 100,
  'live-one': 100,
  'dead-one': 10,
};

function countDirection(board: BoardState, row: number, col: number, dr: number, dc: number, player: number): number {
  let count = 0;
  let r = row + dr;
  let c = col + dc;
  while (inBounds(r, c) && board[r][c] === player) {
    count++;
    r += dr;
    c += dc;
  }
  return count;
}

function isBlocked(board: BoardState, row: number, col: number, dr: number, dc: number, steps: number): boolean {
  const r = row + dr * steps;
  const c = col + dc * steps;
  if (!inBounds(r, c)) return true;
  return board[r][c] !== EMPTY;
}

function evaluateLine(board: BoardState, row: number, col: number, dr: number, dc: number, player: number): number {
  const count = 1 + countDirection(board, row, col, dr, dc, player) + countDirection(board, row, col, -dr, -dc, player);
  if (count >= 5) return SCORE_TABLE['five'];

  const fwd = countDirection(board, row, col, dr, dc, player);
  const bwd = countDirection(board, row, col, -dr, -dc, player);
  const fwdBlocked = isBlocked(board, row + dr * (fwd + 1), col + dc * (fwd + 1), 0, 0, 0) ||
    (!inBounds(row + dr * (fwd + 1), col + dc * (fwd + 1)) || board[row + dr * (fwd + 1)][col + dc * (fwd + 1)] !== EMPTY);
  const bwdBlocked = isBlocked(board, row - dr * (bwd + 1), col - dc * (bwd + 1), 0, 0, 0) ||
    (!inBounds(row - dr * (bwd + 1), col - dc * (bwd + 1)) || board[row - dr * (bwd + 1)][col - dc * (bwd + 1)] !== EMPTY);

  const openEnds = (fwdBlocked ? 0 : 1) + (bwdBlocked ? 0 : 1);

  if (openEnds === 0) return 0;

  const key = count === 4 ? (openEnds === 2 ? 'live-four' : 'dead-four')
    : count === 3 ? (openEnds === 2 ? 'live-three' : 'dead-three')
    : count === 2 ? (openEnds === 2 ? 'live-two' : 'dead-two')
    : (openEnds === 2 ? 'live-one' : 'dead-one');

  return SCORE_TABLE[key] || 0;
}

export class StandardGomokuRules implements GameRules {
  readonly name = 'standard-gomoku';

  isValidMove(board: BoardState, row: number, col: number): boolean {
    if (!inBounds(row, col)) return false;
    return board[row][col] === EMPTY;
  }

  checkWin(board: BoardState, row: number, col: number, player: number): boolean {
    for (const [dr, dc] of DIRECTIONS) {
      const count = 1 + countDirection(board, row, col, dr, dc, player) + countDirection(board, row, col, -dr, -dc, player);
      if (count >= 5) return true;
    }
    return false;
  }

  isBoardFull(board: BoardState): boolean {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] === EMPTY) return false;
      }
    }
    return true;
  }

  evaluateBoard(board: BoardState, aiPlayer: number): number {
    let aiScore = 0;
    let humanScore = 0;
    const humanPlayer = aiPlayer === 1 ? 2 : 1;

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] === aiPlayer) {
          for (const [dr, dc] of DIRECTIONS) {
            aiScore += evaluateLine(board, r, c, dr, dc, aiPlayer);
          }
        } else if (board[r][c] === humanPlayer) {
          for (const [dr, dc] of DIRECTIONS) {
            humanScore += evaluateLine(board, r, c, dr, dc, humanPlayer);
          }
        }
      }
    }
    return aiScore - humanScore * 1.1;
  }

  getCandidateMoves(board: BoardState): [number, number][] {
    const candidates: [number, number][] = [];
    const visited = new Set<string>();

    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (board[r][c] !== EMPTY) {
          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              const key = `${nr},${nc}`;
              if (inBounds(nr, nc) && board[nr][nc] === EMPTY && !visited.has(key)) {
                visited.add(key);
                candidates.push([nr, nc]);
              }
            }
          }
        }
      }
    }
    if (candidates.length === 0 && board[7][7] === EMPTY) {
      candidates.push([7, 7]);
    }
    return candidates;
  }
}
