package com.gobang.ai;

import com.gobang.engine.GameConstants;
import com.gobang.engine.rules.GameRules;

import java.util.List;

public class MinimaxAIStrategy implements AIStrategy {
    private static final int FIVE_SCORE = 1000000;

    @Override
    public String getName() {
        return "minimax-alpha-beta";
    }

    @Override
    public int[] getBestMove(int[][] board, int aiPlayer, GameRules rules, AIOptions options) {
        int depth = options.getDepth();
        List<int[]> candidates = rules.getCandidateMoves(board);
        if (candidates.isEmpty()) return null;

        int[] bestMove = candidates.get(0);
        int bestScore = Integer.MIN_VALUE;

        for (int[] move : candidates) {
            board[move[0]][move[1]] = aiPlayer;
            if (rules.checkWin(board, move[0], move[1], aiPlayer)) {
                board[move[0]][move[1]] = GameConstants.EMPTY;
                return move;
            }
            int score = minimax(board, depth - 1, Integer.MIN_VALUE, Integer.MAX_VALUE, false, aiPlayer, rules);
            board[move[0]][move[1]] = GameConstants.EMPTY;
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        return bestMove;
    }

    private int minimax(int[][] board, int depth, int alpha, int beta, boolean isMaximizing, int aiPlayer, GameRules rules) {
        int humanPlayer = GameConstants.opponentOf(aiPlayer);

        if (depth == 0) return rules.evaluateBoard(board, aiPlayer);

        List<int[]> candidates = rules.getCandidateMoves(board);
        if (candidates.isEmpty()) return rules.evaluateBoard(board, aiPlayer);

        if (isMaximizing) {
            int maxEval = Integer.MIN_VALUE;
            for (int[] move : candidates) {
                board[move[0]][move[1]] = aiPlayer;
                if (rules.checkWin(board, move[0], move[1], aiPlayer)) {
                    board[move[0]][move[1]] = GameConstants.EMPTY;
                    return FIVE_SCORE * (depth + 1);
                }
                int eval = minimax(board, depth - 1, alpha, beta, false, aiPlayer, rules);
                board[move[0]][move[1]] = GameConstants.EMPTY;
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            int minEval = Integer.MAX_VALUE;
            for (int[] move : candidates) {
                board[move[0]][move[1]] = humanPlayer;
                if (rules.checkWin(board, move[0], move[1], humanPlayer)) {
                    board[move[0]][move[1]] = GameConstants.EMPTY;
                    return -FIVE_SCORE * (depth + 1);
                }
                int eval = minimax(board, depth - 1, alpha, beta, true, aiPlayer, rules);
                board[move[0]][move[1]] = GameConstants.EMPTY;
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }
}
