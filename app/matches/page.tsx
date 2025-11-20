'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { matchAPI, Match } from '@/lib/api';

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open'>('open');

  useEffect(() => {
    loadMatches();
  }, [filter]);

  const loadMatches = async () => {
    setLoading(true);
    try {
      const data = filter === 'open' 
        ? await matchAPI.getOpen() 
        : await matchAPI.getAll();
      setMatches(data.matches);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      open: 'bg-green-900 text-green-200',
      'in-progress': 'bg-yellow-900 text-yellow-200',
      completed: 'bg-blue-900 text-blue-200',
      disputed: 'bg-red-900 text-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-900 text-gray-200';
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Find Matches</h1>
          <Link
            href="/create-match"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Match
          </Link>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setFilter('open')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              filter === 'open'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            Open Matches
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md font-medium transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            All Matches
          </button>
        </div>

        {/* Matches List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-white">Loading matches...</div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white mb-4">
              No {filter === 'open' ? 'open ' : ''}matches found
            </div>
            {filter === 'open' && (
              <Link
                href="/create-match"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Create the First Match
              </Link>
            )}
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
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">
                      Created {new Date(match.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded">
                    <div className="text-sm text-gray-400 mb-1">Team 1</div>
                    <div className="font-semibold text-white">{match.team1.name}</div>
                  </div>
                  {match.team2 ? (
                    <div className="bg-gray-800 p-4 rounded">
                      <div className="text-sm text-gray-400 mb-1">Team 2</div>
                      <div className="font-semibold text-white">{match.team2.name}</div>
                    </div>
                  ) : (
                    <div className="bg-gray-800 p-4 rounded border-2 border-dashed border-gray-700">
                      <div className="text-sm text-gray-400 mb-1">Team 2</div>
                      <div className="font-semibold text-blue-600">Waiting for opponent...</div>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="text-sm text-white mb-2">Maps:</div>
                  <div className="flex flex-wrap gap-2">
                    {match.maps.map((map, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-white">
                        {map}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

