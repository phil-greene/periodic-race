import { useState, useEffect } from "react";
import { GameEngine } from "@/lib/gameEngine";

interface LeaderboardEntry {
  playerName: string;
  time: number;
  date: string;
  timestamp: number;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  formatTime: (seconds: number) => string;
}

export default function LeaderboardModal({ isOpen, onClose, formatTime }: LeaderboardModalProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gameEngine] = useState(() => new GameEngine([]));

  useEffect(() => {
    if (isOpen) {
      const scores = gameEngine.getLeaderboard();
      setLeaderboard(scores);
    }
  }, [isOpen, gameEngine]);

  if (!isOpen) return null;

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return 'fas fa-trophy text-yellow-500';
      case 1:
        return 'fas fa-medal text-gray-400';
      case 2:
        return 'fas fa-award text-amber-600';
      default:
        return 'fas fa-user-circle text-gray-400';
    }
  };

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return 'from-yellow-50 to-orange-50 border-yellow-200';
      case 1:
        return 'from-gray-50 to-blue-50 border-gray-200';
      case 2:
        return 'from-amber-50 to-orange-50 border-amber-200';
      default:
        return 'from-gray-50 to-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <i className="fas fa-trophy text-white"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Leaderboard</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-trophy text-4xl text-gray-300 mb-3"></i>
              <p className="text-lg font-medium">No scores yet!</p>
              <p className="text-sm">Be the first to complete the challenge!</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={`${entry.timestamp}-${index}`}
                className={`flex items-center justify-between p-4 bg-gradient-to-r ${getRankColor(index)} rounded-lg border`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <i className={getRankIcon(index)}></i>
                    <span className="font-bold text-gray-900">#{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {entry.playerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-mono font-bold text-emerald-600">
                    {formatTime(entry.time)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {index === 0 ? 'Best Time!' : 'Great Time'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        {leaderboard.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-blue-600 font-medium">Total Players</div>
                <div className="text-xl font-bold text-blue-900">{leaderboard.length}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3">
                <div className="text-sm text-emerald-600 font-medium">Best Time</div>
                <div className="text-xl font-mono font-bold text-emerald-900">
                  {formatTime(leaderboard[0].time)}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
