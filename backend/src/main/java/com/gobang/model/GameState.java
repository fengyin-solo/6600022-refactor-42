package com.gobang.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GameState {
    public static final int BOARD_SIZE = 15;
    public static final int EMPTY = 0;
    public static final int BLACK = 1;
    public static final int WHITE = 2;

    private String id;
    private int[][] board;
    private int currentPlayer;
    private List<Move> moves;
    private Integer winner;
    private String createdAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Move {
        private int row;
        private int col;
        private int player;
        private long timestamp;
    }
}
