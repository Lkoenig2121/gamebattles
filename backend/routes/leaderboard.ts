import express from 'express';
import { db } from '../utils/db';

const router = express.Router();

interface LeaderboardEntry {
  id: string;
  username: string;
  teamName?: string;
  wins: number;
  losses: number;
  totalMatches: number;
  winRate: number;
}

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const users = db.users.getAll();

    // Calculate stats and sort
    const leaderboard: LeaderboardEntry[] = users
      .map((user) => {
        const totalMatches = user.wins + user.losses;
        const winRate = totalMatches > 0 ? (user.wins / totalMatches) * 100 : 0;
        
        return {
          id: user.id,
          username: user.username,
          teamName: user.teamName,
          wins: user.wins,
          losses: user.losses,
          totalMatches,
          winRate: parseFloat(winRate.toFixed(1))
        };
      })
      .sort((a: LeaderboardEntry, b: LeaderboardEntry) => {
        // Sort by wins first, then by win rate
        if (b.wins !== a.wins) {
          return b.wins - a.wins;
        }
        return b.winRate - a.winRate;
      })
      .slice(0, 100); // Top 100 players

    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
});

export default router;

