'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { matchAPI, Match } from '@/lib/api';

export default function MyMatchesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadMatches();
  }, [user, router]);

  const loadMatches = async () => {
    try {
      const data = await matchAPI.getMyMatches();
      setMatches(data.matches);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      open: 'bg-green-900 text-green-200',
      'in-progress': 'bg-yellow-900 text-yellow-200',
      completed: 'bg-blue-900 text-blue-200',
      disputed: 'bg-red-900 text-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-900 text-gray-200';
  };

  const getMatchResult = (match: Match) => {
    if (match.status !== 'completed' || !match.winner) return null;
    
    const userTeam = match.team1.players.includes(user.id) ? 'team1' : 'team2';
    const won = match.winner === userTeam;
    
    return won ? (
      <span className="text-green-400 font-bold">WIN</span>
    ) : (
      <span className="text-red-400 font-bold">LOSS</span>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">My Matches</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-white">Loading matches...</div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white mb-4">You haven't participated in any matches yet</div>
            <Link
              href="/matches"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Find Matches
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {matches.map(match => (
              <Link
                key={match.id}
                href={`/matches/${match.id}`}
                className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{match.gameTitle}</h3>
                    <div className="flex items-center gap-3 text-sm text-white">
                      <span>{match.gameMode}</span>
                      <span>•</span>
                      <span>Best of {match.bestOf}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(match.status)}`}>
                        {match.status.replace('-', ' ').toUpperCase()}
                      </span>
                      {getMatchResult(match) && (
                        <>
                          <span>•</span>
                          {getMatchResult(match)}
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">
                      {new Date(match.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded">
                    <div className="text-sm text-gray-400 mb-1">Team 1</div>
                    <div className="font-semibold text-white">
                      {match.team1.name}
                      {match.winner === 'team1' && ' 🏆'}
                    </div>
                  </div>
                  {match.team2 ? (
                    <div className="bg-gray-800 p-4 rounded">
                      <div className="text-sm text-gray-400 mb-1">Team 2</div>
                      <div className="font-semibold text-white">
                        {match.team2.name}
                        {match.winner === 'team2' && ' 🏆'}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-800 p-4 rounded">
                      <div className="text-sm text-gray-400 mb-1">Team 2</div>
                      <div className="text-blue-600">Waiting for opponent...</div>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

