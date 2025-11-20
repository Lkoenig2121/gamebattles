'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { matchAPI, Match, MapResult } from '@/lib/api';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [teamName, setTeamName] = useState(user?.teamName || user?.username || '');
  const [mapResults, setMapResults] = useState<MapResult[]>([]);
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    if (params.id) {
      loadMatch();
    }
  }, [params.id]);

  const loadMatch = async () => {
    try {
      const data = await matchAPI.getById(params.id as string);
      setMatch(data.match);
      
      // Initialize map results if not already set
      if (data.match.mapResults.length === 0 && mapResults.length === 0) {
        setMapResults(data.match.maps.map(mapName => ({
          mapName,
          team1Score: 0,
          team2Score: 0,
        })));
      } else if (data.match.mapResults.length > 0) {
        setMapResults(data.match.mapResults);
      }
    } catch (error) {
      console.error('Failed to load match:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setJoining(true);
    try {
      await matchAPI.join(params.id as string, teamName);
      await loadMatch();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to join match');
    } finally {
      setJoining(false);
    }
  };

  const handleReportResults = async () => {
    if (!match) return;

    // Calculate winners for each map
    const resultsWithWinners = mapResults.map(result => ({
      ...result,
      winner: result.team1Score > result.team2Score 
        ? 'team1' as const
        : result.team2Score > result.team1Score 
          ? 'team2' as const
          : undefined,
    }));

    setReporting(true);
    try {
      await matchAPI.reportResults(match.id, resultsWithWinners);
      await loadMatch();
      setShowReportForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to report results');
    } finally {
      setReporting(false);
    }
  };

  const updateMapScore = (index: number, team: 'team1' | 'team2', score: number) => {
    const newResults = [...mapResults];
    newResults[index][`${team}Score`] = score;
    setMapResults(newResults);
  };

  const isUserInMatch = user && match && (
    match.team1.players.includes(user.id) || 
    (match.team2 && match.team2.players.includes(user.id))
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading match...</div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Match not found</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'text-green-400',
      'in-progress': 'text-yellow-400',
      completed: 'text-blue-400',
      disputed: 'text-red-400',
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-white">{match.gameTitle}</h1>
              <span className={`text-sm font-medium ${getStatusColor(match.status)}`}>
                {match.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
            <div className="text-gray-400">
              {match.gameMode} • Best of {match.bestOf}
            </div>
          </div>

          {/* Teams */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Team 1</div>
              <div className="text-2xl font-bold text-white mb-2">{match.team1.name}</div>
              {match.winner === 'team1' && (
                <div className="text-green-400 font-medium">🏆 WINNER</div>
              )}
            </div>
            {match.team2 ? (
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="text-sm text-gray-400 mb-2">Team 2</div>
                <div className="text-2xl font-bold text-white mb-2">{match.team2.name}</div>
                {match.winner === 'team2' && (
                  <div className="text-green-400 font-medium">🏆 WINNER</div>
                )}
              </div>
            ) : (
              <div className="bg-gray-800 p-6 rounded-lg border-2 border-dashed border-gray-700">
                <div className="text-sm text-gray-400 mb-2">Team 2</div>
                <div className="text-xl font-bold text-blue-600 mb-4">Looking for opponent...</div>
                {user && !isUserInMatch && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Your team name"
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white placeholder-gray-400"
                    />
                    <button
                      onClick={handleJoin}
                      disabled={joining || !teamName}
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {joining ? 'Joining...' : 'Join Match'}
                    </button>
                  </div>
                )}
                {!user && (
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Login to Join
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Maps */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Maps</h2>
            <div className="space-y-3">
              {match.maps.map((map, idx) => {
                const result = match.mapResults[idx];
                return (
                  <div key={idx} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{map}</div>
                      {result && (
                        <div className="flex gap-4 text-sm">
                          <span className={result.winner === 'team1' ? 'text-green-400 font-bold' : ''}>
                            {match.team1.name}: {result.team1Score}
                          </span>
                          <span>-</span>
                          <span className={result.winner === 'team2' ? 'text-green-400 font-bold' : ''}>
                            {match.team2?.name}: {result.team2Score}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Report Results Section */}
          {isUserInMatch && match.status === 'in-progress' && !showReportForm && (
            <button
              onClick={() => setShowReportForm(true)}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
            >
              Report Match Results
            </button>
          )}

          {showReportForm && match.team2 && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Report Results</h2>
              <div className="space-y-4">
                {mapResults.map((result, idx) => (
                  <div key={idx} className="bg-gray-900 p-4 rounded">
                    <div className="font-medium mb-3">{result.mapName}</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          {match.team1.name} Score
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={result.team1Score}
                          onChange={(e) => updateMapScore(idx, 'team1', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          {match.team2.name} Score
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={result.team2Score}
                          onChange={(e) => updateMapScore(idx, 'team2', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-blue-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleReportResults}
                  disabled={reporting}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {reporting ? 'Submitting...' : 'Submit Results'}
                </button>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Match Info */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-gray-400">
            <div>Created: {new Date(match.createdAt).toLocaleString()}</div>
            {match.completedAt && (
              <div>Completed: {new Date(match.completedAt).toLocaleString()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

