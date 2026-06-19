import { defineStore } from 'pinia';
import { ref, computed, markRaw } from 'vue';
import type { BoardState, Move, GameRecord, AIConfig, GameStatus } from '../types';
import { GameEngine, MinimaxAIStrategy, ReplayManager, StandardGomokuRules, WHITE, cloneBoard } from '../game';

export const useGameStore = defineStore('game', () => {
  const engine = markRaw(new GameEngine());
  const aiStrategy = markRaw(new MinimaxAIStrategy());
  const replayManager = markRaw(new ReplayManager());

  const status = ref<GameStatus>('idle');
  const gameRecords = ref<GameRecord[]>([]);
  const aiConfig = ref<AIConfig>({ depth: 3, enabled: true, playerColor: WHITE });
  const isAiThinking = ref(false);

  const gameVersion = ref(0);
  const replayVersion = ref(0);

  function bumpGameVersion() {
    gameVersion.value++;
  }

  const board = computed<BoardState>(() => {
    gameVersion.value;
    return cloneBoard(engine.board);
  });
  const currentPlayer = computed(() => {
    gameVersion.value;
    return engine.currentPlayer;
  });
  const moves = computed<Move[]>(() => {
    gameVersion.value;
    return [...engine.moves];
  });
  const winner = computed(() => {
    gameVersion.value;
    return engine.winner;
  });
  const currentMoveCount = computed(() => {
    gameVersion.value;
    return engine.moveCount;
  });
  const isGameOver = computed(() => {
    gameVersion.value;
    return engine.isGameOver;
  });

  const replayBoard = computed<BoardState>(() => {
    replayVersion.value;
    return cloneBoard(replayManager.board);
  });
  const replayIndex = computed(() => {
    replayVersion.value;
    return replayManager.index;
  });
  const replayMoves = computed(() => {
    replayVersion.value;
    return replayManager.moves;
  });
  const isReplayPlaying = computed(() => replayManager.isPlaying);
  const replaySpeed = computed(() => replayManager.speed);

  replayManager.setOnChange(() => {
    replayVersion.value++;
  });

  function startGame() {
    engine.reset();
    status.value = 'playing';
    isAiThinking.value = false;
    bumpGameVersion();
  }

  function placeStone(row: number, col: number): boolean {
    if (status.value !== 'playing') return false;
    if (isAiThinking.value) return false;

    const success = engine.placeStone(row, col);
    if (success) {
      bumpGameVersion();
      if (engine.isGameOver) {
        saveRecord();
      }
    }
    return success;
  }

  async function aiMove() {
    if (!aiConfig.value.enabled || status.value !== 'playing') return;
    if (currentPlayer.value !== aiConfig.value.playerColor) return;

    isAiThinking.value = true;
    await new Promise(resolve => setTimeout(resolve, 100));

    const move = aiStrategy.getBestMove(
      engine.board,
      aiConfig.value.playerColor,
      engine.rules,
      { depth: aiConfig.value.depth }
    );
    if (move) {
      placeStone(move[0], move[1]);
    }
    isAiThinking.value = false;
  }

  function saveRecord() {
    const allMoves = engine.moves;
    const record: GameRecord = {
      id: Date.now().toString(),
      moves: [...allMoves],
      winner: engine.winner,
      createdAt: new Date().toLocaleString('zh-CN'),
      duration: allMoves.length > 0 ? allMoves[allMoves.length - 1].timestamp - allMoves[0].timestamp : 0,
    };
    gameRecords.value.unshift(record);
  }

  function startReplay(record: GameRecord) {
    replayManager.loadRecord(record);
    status.value = 'replaying';
  }

  function replayStepForward() {
    replayManager.stepForward();
  }

  function replayStepBack() {
    replayManager.stepBack();
  }

  function replayGoToStart() {
    replayManager.goToStart();
  }

  function replayGoToEnd() {
    replayManager.goToEnd();
  }

  function toggleReplayPlay() {
    replayManager.togglePlay();
  }

  function setReplaySpeed(ms: number) {
    replayManager.setSpeed(ms);
  }

  function stopReplay() {
    replayManager.stop();
    status.value = 'idle';
  }

  function checkWin(row: number, col: number): boolean {
    return engine.checkWinAt(row, col);
  }

  return {
    board, currentPlayer, moves, status, winner, gameRecords, aiConfig, isAiThinking,
    replayMoves, replayIndex, replayBoard, isReplayPlaying, replaySpeed,
    currentMoveCount, isGameOver,
    startGame, placeStone, aiMove, saveRecord,
    startReplay, replayStepForward, replayStepBack, replayGoToStart, replayGoToEnd,
    toggleReplayPlay, setReplaySpeed, stopReplay, checkWin,
  };
});
