import express from 'express';
import User from '../models/User';
import connectDB from '../utils/db';

const router = express.Router();

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    await connectDB();

    const users = await User.find({})
      .select('username teamName wins losses')
      .lean();

    // Calculate stats and sort
    const leaderboard = users
      .map(user => {
        const totalMatches = user.wins + user.losses;
        const winRate = totalMatches > 0 ? (user.wins / totalMatches) * 100 : 0;
        
        return {
          id: user._id.toString(),
          username: user.username,
          teamName: user.teamName,
          wins: user.wins,
          losses: user.losses,
          totalMatches,
          winRate: parseFloat(winRate.toFixed(1))
        };
      })
      .sort((a, b) => {
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

