package com.gobang.engine.rules;

import com.gobang.engine.GameConstants;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class StandardGomokuRules implements GameRules {
    private static final int FIVE = 1000000;
    private static final int LIVE_FOUR = 100000;
    private static final int DEAD_FOUR = 10000;
    private static final int LIVE_THREE = 10000;
    private static final int DEAD_THREE = 1000;
    private static final int LIVE_TWO = 1000;
    private static final int DEAD_TWO = 100;
    private static final int LIVE_ONE = 100;
    private static final int DEAD_ONE = 10;

    @Override
    public String getName() {
        return "standard-gomoku";
    }

    @Override
    public boolean isValidMove(int[][] board, int row, int col, int player) {
        if (!GameConstants.inBounds(row, col)) return false;
        return board[row][col] == GameConstants.EMPTY;
    }

    @Override
    public boolean checkWin(int[][] board, int row, int col, int player) {
        for (int[] dir : GameConstants.DIRECTIONS) {
            int count = 1;
            count += countDirection(board, row, col, dir[0], dir[1], player);
            count += countDirection(board, row, col, -dir[0], -dir[1], player);
            if (count >= 5) return true;
        }
        return false;
    }

    @Override
    public boolean isBoardFull(int[][] board) {
        for (int r = 0; r < GameConstants.BOARD_SIZE; r++) {
            for (int c = 0; c < GameConstants.BOARD_SIZE; c++) {
                if (board[r][c] == GameConstants.EMPTY) return false;
            }
        }
        return true;
    }

    @Override
    public int evaluateBoard(int[][] board, int aiPlayer) {
        int aiScore = 0;
        int humanScore = 0;
        int humanPlayer = GameConstants.opponentOf(aiPlayer);

        for (int r = 0; r < GameConstants.BOARD_SIZE; r++) {
            for (int c = 0; c < GameConstants.BOARD_SIZE; c++) {
                if (board[r][c] == aiPlayer) {
                    for (int[] dir : GameConstants.DIRECTIONS) {
                        aiScore += evaluateLine(board, r, c, dir[0], dir[1], aiPlayer);
                    }
                } else if (board[r][c] == humanPlayer) {
                    for (int[] dir : GameConstants.DIRECTIONS) {
                        humanScore += evaluateLine(board, r, c, dir[0], dir[1], humanPlayer);
                    }
                }
            }
        }
        return aiScore - (int) (humanScore * 1.1);
    }

    @Override
    public List<int[]> getCandidateMoves(int[][] board) {
        List<int[]> candidates = new ArrayList<>();
        Set<String> visited = new HashSet<>();

        for (int r = 0; r < GameConstants.BOARD_SIZE; r++) {
            for (int c = 0; c < GameConstants.BOARD_SIZE; c++) {
                if (board[r][c] != GameConstants.EMPTY) {
                    for (int dr = -2; dr <= 2; dr++) {
                        for (int dc = -2; dc <= 2; dc++) {
                            int nr = r + dr, nc = c + dc;
                            String key = nr + "," + nc;
                            if (GameConstants.inBounds(nr, nc) && board[nr][nc] == GameConstants.EMPTY && !visited.contains(key)) {
                                visited.add(key);
                                candidates.add(new int[]{nr, nc});
                            }
                        }
                    }
                }
            }
        }

        if (candidates.isEmpty() && board[7][7] == GameConstants.EMPTY) {
            candidates.add(new int[]{7, 7});
        }
        return candidates;
    }

    private int countDirection(int[][] board, int row, int col, int dr, int dc, int player) {
        int count = 0;
        int r = row + dr, c = col + dc;
        while (GameConstants.inBounds(r, c) && board[r][c] == player) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    private int evaluateLine(int[][] board, int row, int col, int dr, int dc, int player) {
        int fwd = countDirection(board, row, col, dr, dc, player);
        int bwd = countDirection(board, row, col, -dr, -dc, player);
        int count = 1 + fwd + bwd;

        if (count >= 5) return FIVE;

        boolean fwdBlocked = !GameConstants.inBounds(row + dr * (fwd + 1), col + dc * (fwd + 1))
                || board[row + dr * (fwd + 1)][col + dc * (fwd + 1)] != GameConstants.EMPTY;
        boolean bwdBlocked = !GameConstants.inBounds(row - dr * (bwd + 1), col - dc * (bwd + 1))
                || board[row - dr * (bwd + 1)][col - dc * (bwd + 1)] != GameConstants.EMPTY;

        int openEnds = (fwdBlocked ? 0 : 1) + (bwdBlocked ? 0 : 1);
        if (openEnds == 0) return 0;

        if (count == 4) return openEnds == 2 ? LIVE_FOUR : DEAD_FOUR;
        if (count == 3) return openEnds == 2 ? LIVE_THREE : DEAD_THREE;
        if (count == 2) return openEnds == 2 ? LIVE_TWO : DEAD_TWO;
        return openEnds == 2 ? LIVE_ONE : DEAD_ONE;
    }
}
