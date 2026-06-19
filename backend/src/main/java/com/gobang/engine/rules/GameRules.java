package com.gobang.engine.rules;

import java.util.List;

public interface GameRules {
    String getName();

    boolean isValidMove(int[][] board, int row, int col, int player);

    boolean checkWin(int[][] board, int row, int col, int player);

    boolean isBoardFull(int[][] board);

    int evaluateBoard(int[][] board, int aiPlayer);

    List<int[]> getCandidateMoves(int[][] board);
}
