import { useState, useEffect, useCallback } from "react";
import GameHeader from "@/components/GameHeader";
import PeriodicTableGrid from "@/components/PeriodicTableGrid";
import AnswerOptions from "@/components/AnswerOptions";
import GameModal from "@/components/GameModal";
import LeaderboardModal from "@/components/LeaderboardModal";
import MotivationalDisplay from "@/components/MotivationalDisplay";
import { GameEngine } from "@/lib/gameEngine";
import { AudioManager } from "@/lib/audioManager";
import { elements } from "@/data/elements";

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  currentElementIndex: number;
  score: number;
  timeLeft: number;
  filledElements: Set<number>;
  currentOptions: any[];
  gameStartTime: number | null;
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    currentElementIndex: 0,
    score: 0,
    timeLeft: 300, // 5 minutes
    filledElements: new Set(),
    currentOptions: [],
    gameStartTime: null,
  });
  
  const [showGameModal, setShowGameModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameResult, setGameResult] = useState<'win' | 'lose' | null>(null);
  const [showMotivational, setShowMotivational] = useState(false);
  const [gameEngine] = useState(() => new GameEngine(elements));
  const [audioManager] = useState(() => new AudioManager());

  // Initialize audio on component mount
  useEffect(() => {
    audioManager.initialize();
  }, [audioManager]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isPlaying && !gameState.isPaused && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState(prev => {
          const newTimeLeft = prev.timeLeft - 1;
          if (newTimeLeft <= 0) {
            // Game over - time's up
            setGameResult('lose');
            setShowGameModal(true);
            return { ...prev, isPlaying: false, timeLeft: 0 };
          }
          return { ...prev, timeLeft: newTimeLeft };
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeLeft]);

  // Generate initial options when game starts
  useEffect(() => {
    if (gameState.isPlaying && gameState.currentOptions.length === 0) {
      const options = gameEngine.generateOptions(gameState.currentElementIndex);
      setGameState(prev => ({ ...prev, currentOptions: options }));
    }
  }, [gameState.isPlaying, gameState.currentElementIndex, gameState.currentOptions.length, gameEngine]);

  const startGame = useCallback(() => {
    const options = gameEngine.generateOptions(0);
    setGameState({
      isPlaying: true,
      isPaused: false,
      currentElementIndex: 0,
      score: 0,
      timeLeft: 300,
      filledElements: new Set(),
      currentOptions: options,
      gameStartTime: Date.now(),
    });
    setShowGameModal(false);
    setGameResult(null);
  }, [gameEngine]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const restartGame = useCallback(() => {
    setGameState({
      isPlaying: false,
      isPaused: false,
      currentElementIndex: 0,
      score: 0,
      timeLeft: 300,
      filledElements: new Set(),
      currentOptions: [],
      gameStartTime: null,
    });
    setShowGameModal(false);
    setGameResult(null);
  }, []);

  const handleAnswer = useCallback((selectedIndex: number) => {
    if (!gameState.isPlaying || gameState.isPaused) return;

    const selectedOption = gameState.currentOptions[selectedIndex];
    const correctElement = elements[gameState.currentElementIndex];

    if (selectedOption.atomicNumber === correctElement.atomicNumber) {
      // Correct answer
      audioManager.playCorrect();
      
      const newFilledElements = new Set(gameState.filledElements);
      newFilledElements.add(correctElement.atomicNumber);
      
      const newScore = gameState.score + 1;
      const newIndex = gameState.currentElementIndex + 1;

      // Check for milestone achievements (every 25 elements)
      const shouldShowMotivational = newScore > 0 && newScore % 25 === 0 && newIndex < elements.length;

      if (newIndex >= elements.length) {
        // Game completed!
        const completionTime = 300 - gameState.timeLeft;
        gameEngine.saveScore(completionTime);
        setGameResult('win');
        setShowGameModal(true);
        setGameState(prev => ({
          ...prev,
          isPlaying: false,
          score: newScore,
          filledElements: newFilledElements,
        }));
      } else if (shouldShowMotivational) {
        // Show motivational content at milestone
        setGameState(prev => ({
          ...prev,
          currentElementIndex: newIndex,
          score: newScore,
          filledElements: newFilledElements,
          isPaused: true,
        }));
        setShowMotivational(true);
      } else {
        // Continue to next element
        const nextOptions = gameEngine.generateOptions(newIndex);
        setGameState(prev => ({
          ...prev,
          currentElementIndex: newIndex,
          score: newScore,
          filledElements: newFilledElements,
          currentOptions: nextOptions,
        }));
      }
    } else {
      // Wrong answer
      audioManager.playWrong();
      // Add wiggle effect handled by AnswerOptions component
    }
  }, [gameState, audioManager, gameEngine]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isPaused) return;
      
      const key = event.key;
      if (['1', '2', '3', '4'].includes(key)) {
        event.preventDefault();
        const optionIndex = parseInt(key) - 1;
        handleAnswer(optionIndex);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, gameState.isPaused, handleAnswer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCompletionTime = () => {
    if (gameState.gameStartTime) {
      return 300 - gameState.timeLeft;
    }
    return 0;
  };

  const handleCloseMotivational = useCallback(() => {
    setShowMotivational(false);
    // Resume game and generate next options
    const nextOptions = gameEngine.generateOptions(gameState.currentElementIndex);
    setGameState(prev => ({
      ...prev,
      isPaused: false,
      currentOptions: nextOptions,
    }));
  }, [gameState.currentElementIndex, gameEngine]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <GameHeader
        score={gameState.score}
        timeLeft={gameState.timeLeft}
        formatTime={formatTime}
        onShowLeaderboard={() => setShowLeaderboard(true)}
        currentElementIndex={gameState.currentElementIndex}
        isPlaying={gameState.isPlaying}
      />
      
      <main className="flex-1 max-w-7xl mx-auto px-2 py-1 w-full overflow-hidden">

        <PeriodicTableGrid
          elements={elements}
          filledElements={gameState.filledElements}
          currentElementIndex={gameState.currentElementIndex}
          isPlaying={gameState.isPlaying}
        />

        <AnswerOptions
          options={gameState.currentOptions}
          currentElementIndex={gameState.currentElementIndex}
          onAnswer={handleAnswer}
          isPlaying={gameState.isPlaying}
          isPaused={gameState.isPaused}
        />

        <div className="flex justify-center space-x-2 mt-2">
          {!gameState.isPlaying ? (
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-sm"
            >
              <i className="fas fa-play mr-2"></i>
              Start Game
            </button>
          ) : (
            <button
              onClick={pauseGame}
              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500/20 text-sm"
            >
              <i className={`fas ${gameState.isPaused ? 'fa-play' : 'fa-pause'} mr-2`}></i>
              {gameState.isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
          
          <button
            onClick={restartGame}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500/20 text-sm"
          >
            <i className="fas fa-refresh mr-2"></i>
            Restart
          </button>
          
          <button
            onClick={() => setShowLeaderboard(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 text-sm"
          >
            <i className="fas fa-trophy mr-2"></i>
            Leaderboard
          </button>
        </div>


      </main>

      <GameModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
        result={gameResult}
        score={gameState.score}
        completionTime={getCompletionTime()}
        onPlayAgain={startGame}
        onViewLeaderboard={() => {
          setShowGameModal(false);
          setShowLeaderboard(true);
        }}
        formatTime={formatTime}
      />

      <LeaderboardModal
        isOpen={showLeaderboard}
        onClose={() => setShowLeaderboard(false)}
        formatTime={formatTime}
      />

      <MotivationalDisplay
        isVisible={showMotivational}
        onClose={handleCloseMotivational}
      />
    </div>
  );
}
