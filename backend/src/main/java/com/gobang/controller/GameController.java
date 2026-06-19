package com.gobang.controller;

import com.gobang.engine.GameEngine;
import com.gobang.model.GameState;
import com.gobang.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/game")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private AiService aiService;

    private final Map<String, GameEngine> games = new ConcurrentHashMap<>();

    @PostMapping("/new")
    public ResponseEntity<GameState> newGame() {
        String id = UUID.randomUUID().toString();
        GameEngine engine = new GameEngine(id);
        games.put(id, engine);
        return ResponseEntity.ok(engine.getState());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameState> getGame(@PathVariable String id) {
        GameEngine engine = games.get(id);
        if (engine == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(engine.getState());
    }

    @PostMapping("/{id}/move")
    public ResponseEntity<?> makeMove(@PathVariable String id, @RequestBody Map<String, Integer> body) {
        GameEngine engine = games.get(id);
        if (engine == null) return ResponseEntity.notFound().build();
        if (engine.getWinner() != null) return ResponseEntity.badRequest().body("Game is over");

        int row = body.getOrDefault("row", -1);
        int col = body.getOrDefault("col", -1);

        if (!engine.placeStone(row, col)) {
            return ResponseEntity.badRequest().body("Invalid move");
        }
        return ResponseEntity.ok(engine.getState());
    }

    @PostMapping("/{id}/ai-move")
    public ResponseEntity<?> aiMove(@PathVariable String id, @RequestBody Map<String, Integer> body) {
        GameEngine engine = games.get(id);
        if (engine == null) return ResponseEntity.notFound().build();
        if (engine.getWinner() != null) return ResponseEntity.badRequest().body("Game is over");

        int aiPlayer = body.getOrDefault("player", GameState.WHITE);
        int depth = body.getOrDefault("depth", 3);

        int[] move = aiService.getBestMove(engine.getBoard(), aiPlayer, depth, engine.getRules());
        if (move == null) return ResponseEntity.badRequest().body("No valid move");

        engine.placeStone(move[0], move[1]);
        return ResponseEntity.ok(engine.getState());
    }

    @GetMapping("/records")
    public ResponseEntity<List<GameState>> getRecords() {
        List<GameState> finished = games.values().stream()
                .filter(e -> e.getWinner() != null)
                .map(GameEngine::getState)
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .toList();
        return ResponseEntity.ok(finished);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable String id) {
        games.remove(id);
        return ResponseEntity.ok().build();
    }
}
