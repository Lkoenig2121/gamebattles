'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { matchAPI, GameTitle, GameMode } from '@/lib/api';

// Modern Warfare 2 maps
const MW2_MAPS = [
  'Afghan', 'Derail', 'Estate', 'Favela', 'Highrise', 'Invasion', 
  'Karachi', 'Quarry', 'Rundown', 'Rust', 'Scrapyard', 'Skidrow', 
  'Sub Base', 'Terminal', 'Underpass', 'Wasteland'
];

const GAME_TITLES: GameTitle[] = ['Modern Warfare 2', 'Black Ops', 'Modern Warfare 3', 'Black Ops 2'];
const GAME_MODES: GameMode[] = ['Search and Destroy', 'Capture the Flag', 'Domination', 'Team Deathmatch'];

export default function CreateMatchPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [gameTitle, setGameTitle] = useState<GameTitle>('Modern Warfare 2');
  const [gameMode, setGameMode] = useState<GameMode>('Search and Destroy');
  const [bestOf, setBestOf] = useState(3);
  const [teamName, setTeamName] = useState(user?.teamName || user?.username || '');
  const [selectedMaps, setSelectedMaps] = useState<string[]>([]);

  if (!user) {
    router.push('/login');
    return null;
  }

  const toggleMap = (map: string) => {
    if (selectedMaps.includes(map)) {
      setSelectedMaps(selectedMaps.filter(m => m !== map));
    } else if (selectedMaps.length < bestOf) {
      setSelectedMaps([...selectedMaps, map]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (selectedMaps.length !== bestOf) {
      setError(`Please select exactly ${bestOf} maps`);
      return;
    }

    setLoading(true);

    try {
      const { match } = await matchAPI.create({
        gameTitle,
        gameMode,
        bestOf,
        team1Name: teamName,
        maps: selectedMaps,
      });
      router.push(`/matches/${match.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create match');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-8">Create a Match</h1>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Game Title */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Game Title
              </label>
              <select
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value as GameTitle)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white placeholder-gray-400"
              >
                {GAME_TITLES.map(title => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            </div>

            {/* Game Mode */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Game Mode
              </label>
              <select
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value as GameMode)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white placeholder-gray-400"
              >
                {GAME_MODES.map(mode => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
            </div>

            {/* Best Of */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Best Of
              </label>
              <select
                value={bestOf}
                onChange={(e) => {
                  const newBestOf = parseInt(e.target.value);
                  setBestOf(newBestOf);
                  if (selectedMaps.length > newBestOf) {
                    setSelectedMaps(selectedMaps.slice(0, newBestOf));
                  }
                }}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white placeholder-gray-400"
              >
                <option value={1}>1 Map</option>
                <option value={3}>Best of 3</option>
                <option value={5}>Best of 5</option>
              </select>
            </div>

            {/* Team Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Your Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-600 focus:border-transparent text-white placeholder-gray-400"
                placeholder="Enter team name"
              />
            </div>

            {/* Map Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Select {bestOf} Map{bestOf > 1 ? 's' : ''} ({selectedMaps.length}/{bestOf} selected)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {MW2_MAPS.map(map => (
                  <button
                    key={map}
                    type="button"
                    onClick={() => toggleMap(map)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                      selectedMaps.includes(map)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {map}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || selectedMaps.length !== bestOf}
                className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Match'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

