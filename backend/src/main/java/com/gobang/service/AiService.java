package com.gobang.service;

import com.gobang.ai.AIStrategy;
import com.gobang.ai.MinimaxAIStrategy;
import com.gobang.engine.rules.GameRules;
import com.gobang.engine.rules.StandardGomokuRules;
import org.springframework.stereotype.Service;

@Service
public class AiService {
    private final AIStrategy aiStrategy;
    private final GameRules defaultRules;

    public AiService() {
        this.aiStrategy = new MinimaxAIStrategy();
        this.defaultRules = new StandardGomokuRules();
    }

    public int[] getBestMove(int[][] board, int aiPlayer, int depth) {
        return aiStrategy.getBestMove(board, aiPlayer, defaultRules, new AIStrategy.AIOptions(depth));
    }

    public int[] getBestMove(int[][] board, int aiPlayer, int depth, GameRules rules) {
        return aiStrategy.getBestMove(board, aiPlayer, rules, new AIStrategy.AIOptions(depth));
    }

    public AIStrategy getAiStrategy() {
        return aiStrategy;
    }

    public GameRules getDefaultRules() {
        return defaultRules;
    }
}
