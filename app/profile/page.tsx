"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { matchAPI, Match } from "@/lib/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadMatches();
  }, [user, router]);

  const loadMatches = async () => {
    try {
      const data = await matchAPI.getMyMatches();
      setMatches(data.matches.filter((m) => m.status === "completed"));
    } catch (error) {
      console.error("Failed to load matches:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  const winRate =
    user.wins + user.losses > 0
      ? ((user.wins / (user.wins + user.losses)) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {user.username}
              </h1>
              {user.teamName && (
                <div className="text-xl text-white">{user.teamName}</div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-400">
                {user.wins}
              </div>
              <div className="text-sm text-white mt-1">Wins</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-red-400">
                {user.losses}
              </div>
              <div className="text-sm text-white mt-1">Losses</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-400">
                {user.wins + user.losses}
              </div>
              <div className="text-sm text-white mt-1">Total Matches</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {winRate}%
              </div>
              <div className="text-sm text-white mt-1">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Recent Matches */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Matches</h2>

          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Loading matches...
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No completed matches yet
            </div>
          ) : (
            <div className="space-y-4">
              {matches.slice(0, 10).map((match) => {
                const userTeam = match.team1.players.includes(user.id)
                  ? "team1"
                  : "team2";
                const won = match.winner === userTeam;
                const opponentTeam =
                  userTeam === "team1" ? match.team2 : match.team1;

                return (
                  <div key={match.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div
                          className={`font-bold ${
                            won ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {won ? "WIN" : "LOSS"}
                        </div>
                        <div>
                          <div className="font-medium text-white">{match.gameTitle}</div>
                          <div className="text-sm text-white">
                            vs {opponentTeam?.name || "Unknown"} •{" "}
                            {match.gameMode}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-white">
                          {new Date(match.completedAt!).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-gray-900 rounded-lg shadow-xl p-8 mt-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            Account Information
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-white">Email</div>
              <div className="font-medium text-white">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-white">Member Since</div>
              <div className="font-medium text-white">
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
