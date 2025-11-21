'use client';

import { useState, useEffect } from 'react';
import { leaderboardAPI, LeaderboardEntry } from '@/lib/api';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { leaderboard: data } = await leaderboardAPI.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-white';
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-xl p-8">
          <h1 className="text-4xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400 mb-8">Top players ranked by wins and win rate</p>

          {loading ? (
            <div className="text-center py-12 text-white">Loading leaderboard...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-12 text-white">
              No players on the leaderboard yet. Be the first to compete!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-4 text-white font-semibold">Rank</th>
                    <th className="text-left py-4 px-4 text-white font-semibold">Player</th>
                    <th className="text-left py-4 px-4 text-white font-semibold">Team</th>
                    <th className="text-center py-4 px-4 text-white font-semibold">Wins</th>
                    <th className="text-center py-4 px-4 text-white font-semibold">Losses</th>
                    <th className="text-center py-4 px-4 text-white font-semibold">Total</th>
                    <th className="text-center py-4 px-4 text-white font-semibold">Win Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    const rank = index + 1;
                    return (
                      <tr
                        key={entry.id}
                        className={`border-b border-gray-800 hover:bg-gray-800 transition ${
                          rank <= 3 ? 'bg-gray-800/50' : ''
                        }`}
                      >
                        <td className={`py-4 px-4 font-bold text-xl ${getRankColor(rank)}`}>
                          {getRankMedal(rank)}
                        </td>
                        <td className="py-4 px-4 text-white font-medium">{entry.username}</td>
                        <td className="py-4 px-4 text-white">{entry.teamName || '-'}</td>
                        <td className="py-4 px-4 text-center text-green-400 font-semibold">
                          {entry.wins}
                        </td>
                        <td className="py-4 px-4 text-center text-red-400 font-semibold">
                          {entry.losses}
                        </td>
                        <td className="py-4 px-4 text-center text-white">{entry.totalMatches}</td>
                        <td className="py-4 px-4 text-center text-blue-400 font-semibold">
                          {entry.winRate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {!loading && leaderboard.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">Most Wins</h3>
              <p className="text-2xl font-bold text-green-400">
                {leaderboard[0]?.username} - {leaderboard[0]?.wins}W
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">Best Win Rate</h3>
              <p className="text-2xl font-bold text-blue-400">
                {[...leaderboard]
                  .filter(e => e.totalMatches >= 5)
                  .sort((a, b) => b.winRate - a.winRate)[0]?.username || '-'} -{' '}
                {[...leaderboard]
                  .filter(e => e.totalMatches >= 5)
                  .sort((a, b) => b.winRate - a.winRate)[0]?.winRate || 0}%
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-white font-semibold mb-2">Total Players</h3>
              <p className="text-2xl font-bold text-white">{leaderboard.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

