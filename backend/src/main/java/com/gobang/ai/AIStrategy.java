package com.gobang.ai;

import com.gobang.engine.rules.GameRules;

public interface AIStrategy {
    String getName();

    int[] getBestMove(int[][] board, int aiPlayer, GameRules rules, AIOptions options);

    class AIOptions {
        private int depth = 3;

        public AIOptions() {}

        public AIOptions(int depth) {
            this.depth = depth;
        }

        public int getDepth() {
            return depth;
        }

        public void setDepth(int depth) {
            this.depth = depth;
        }
    }
}
