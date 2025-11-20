'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-white">Competitive Gaming</span>
              <br />
              <span className="text-blue-600">Starts Here</span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
              Join the ultimate competitive gaming platform. Find matches, compete against skilled players, 
              and prove you're the best in Call of Duty.
            </p>
            <div className="flex justify-center gap-4">
              {user ? (
                <>
                  <Link
                    href="/matches"
                    className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
                  >
                    Find Matches
                  </Link>
                  <Link
                    href="/create-match"
                    className="bg-gray-800 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-700 transition"
                  >
                    Create Match
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/matches"
                    className="bg-gray-800 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-700 transition"
                  >
                    Browse Matches
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-white">Simple, fast, and competitive</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="text-blue-600 text-4xl mb-4">1</div>
              <h3 className="text-2xl font-bold text-white mb-3">Create or Find a Match</h3>
              <p className="text-white">
                Set up your own match or browse available matches. Choose your game, mode, and maps.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="text-blue-600 text-4xl mb-4">2</div>
              <h3 className="text-2xl font-bold text-white mb-3">Compete</h3>
              <p className="text-white">
                Face off against skilled opponents in best-of-3 series across multiple maps and game modes.
              </p>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg">
              <div className="text-blue-600 text-4xl mb-4">3</div>
              <h3 className="text-2xl font-bold text-white mb-3">Report Results</h3>
              <p className="text-white">
                After the match, report your results and climb the leaderboard. Build your reputation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Games Section */}
      <div className="bg-gray-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Supported Games</h2>
            <p className="text-xl text-white">Classic Call of Duty titles</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Modern Warfare 2', 'Black Ops', 'Modern Warfare 3', 'Black Ops 2'].map(game => (
              <div key={game} className="bg-gray-900 p-6 rounded-lg text-center hover:bg-gray-800 transition">
                <h3 className="text-xl font-bold text-white">{game}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Modes Section */}
      <div className="bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Game Modes</h2>
            <p className="text-xl text-white">Compete in various competitive modes</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Search and Destroy', desc: 'Tactical elimination' },
              { name: 'Capture the Flag', desc: 'Objective-based' },
              { name: 'Domination', desc: 'Control the map' },
              { name: 'Team Deathmatch', desc: 'Classic combat' }
            ].map(mode => (
              <div key={mode.name} className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">{mode.name}</h3>
                <p className="text-white text-sm">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-gray-950 py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Compete?</h2>
            <p className="text-xl text-white mb-8">
              Join thousands of competitive players and start your journey today.
            </p>
            <Link
              href="/register"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
