package com.gobang.engine;

public final class GameConstants {
    public static final int BOARD_SIZE = 15;
    public static final int EMPTY = 0;
    public static final int BLACK = 1;
    public static final int WHITE = 2;

    public static final int[][] DIRECTIONS = {{0, 1}, {1, 0}, {1, 1}, {1, -1}};

    private GameConstants() {}

    public static int[][] createEmptyBoard() {
        return new int[BOARD_SIZE][BOARD_SIZE];
    }

    public static int[][] cloneBoard(int[][] board) {
        int[][] copy = new int[BOARD_SIZE][BOARD_SIZE];
        for (int r = 0; r < BOARD_SIZE; r++) {
            System.arraycopy(board[r], 0, copy[r], 0, BOARD_SIZE);
        }
        return copy;
    }

    public static boolean inBounds(int r, int c) {
        return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
    }

    public static int opponentOf(int player) {
        return player == BLACK ? WHITE : BLACK;
    }
}
