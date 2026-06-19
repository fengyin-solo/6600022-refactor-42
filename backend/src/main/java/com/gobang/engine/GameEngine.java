package com.gobang.engine;

import com.gobang.engine.rules.GameRules;
import com.gobang.engine.rules.StandardGomokuRules;
import com.gobang.model.GameState;

import java.util.ArrayList;

public class GameEngine {
    private GameState state;
    private GameRules rules;

    public GameEngine(String gameId) {
        this(gameId, new StandardGomokuRules());
    }

    public GameEngine(String gameId, GameRules rules) {
        this.rules = rules;
        this.state = new GameState();
        this.state.setId(gameId);
        this.state.setBoard(GameConstants.createEmptyBoard());
        this.state.setCurrentPlayer(GameConstants.BLACK);
        this.state.setMoves(new ArrayList<>());
        this.state.setWinner(null);
        this.state.setCreatedAt(java.time.LocalDateTime.now().toString());
    }

    public GameState getState() {
        return state;
    }

    public GameRules getRules() {
        return rules;
    }

    public void setRules(GameRules rules) {
        this.rules = rules;
    }

    public int[][] getBoard() {
        return state.getBoard();
    }

    public int getCurrentPlayer() {
        return state.getCurrentPlayer();
    }

    public Integer getWinner() {
        return state.getWinner();
    }

    public boolean isGameOver() {
        return state.getWinner() != null;
    }

    public boolean placeStone(int row, int col) {
        if (isGameOver()) return false;
        if (!rules.isValidMove(state.getBoard(), row, col, state.getCurrentPlayer())) return false;

        state.getBoard()[row][col] = state.getCurrentPlayer();
        state.getMoves().add(new GameState.Move(row, col, state.getCurrentPlayer(), System.currentTimeMillis()));

        if (rules.checkWin(state.getBoard(), row, col, state.getCurrentPlayer())) {
            state.setWinner(state.getCurrentPlayer());
            return true;
        }

        if (rules.isBoardFull(state.getBoard())) {
            state.setWinner(0);
            return true;
        }

        state.setCurrentPlayer(GameConstants.opponentOf(state.getCurrentPlayer()));
        return true;
    }

    public boolean checkWinAt(int row, int col) {
        if (state.getBoard()[row][col] == GameConstants.EMPTY) return false;
        return rules.checkWin(state.getBoard(), row, col, state.getBoard()[row][col]);
    }

    public void reset() {
        state.setBoard(GameConstants.createEmptyBoard());
        state.setCurrentPlayer(GameConstants.BLACK);
        state.setMoves(new ArrayList<>());
        state.setWinner(null);
    }

    public GameEngine clone() {
        GameEngine engine = new GameEngine(state.getId(), rules);
        engine.state.setBoard(GameConstants.cloneBoard(state.getBoard()));
        engine.state.setCurrentPlayer(state.getCurrentPlayer());
        engine.state.setMoves(new ArrayList<>(state.getMoves()));
        engine.state.setWinner(state.getWinner());
        engine.state.setCreatedAt(state.getCreatedAt());
        return engine;
    }
}
