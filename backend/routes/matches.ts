import { Router } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../utils/db';
import { Match, MatchCreateDTO, MapResult } from '../models/Match';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all open matches
router.get('/open', (req, res) => {
  try {
    const matches = db.matches.getOpen();
    res.json({ matches });
  } catch (error) {
    console.error('Get open matches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all matches
router.get('/', (req, res) => {
  try {
    const matches = db.matches.getAll();
    res.json({ matches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's matches
router.get('/my-matches', authMiddleware, (req: AuthRequest, res) => {
  try {
    const matches = db.matches.getUserMatches(req.userId!);
    res.json({ matches });
  } catch (error) {
    console.error('Get user matches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single match
router.get('/:id', (req, res) => {
  try {
    const match = db.matches.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    res.json({ match });
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create match
router.post('/', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { gameTitle, gameMode, bestOf, team1Name, maps }: MatchCreateDTO = req.body;

    if (!gameTitle || !gameMode || !bestOf || !team1Name || !maps) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (maps.length !== bestOf) {
      return res.status(400).json({ error: 'Number of maps must match bestOf value' });
    }

    const user = db.users.findById(req.userId!);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const match: Match = {
      id: randomUUID(),
      gameTitle,
      gameMode,
      bestOf,
      team1: {
        id: randomUUID(),
        name: team1Name,
        players: [user.id]
      },
      maps,
      mapResults: [],
      status: 'open',
      createdBy: user.id,
      createdAt: new Date()
    };

    db.matches.create(match);
    res.json({ match });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join match
router.post('/:id/join', authMiddleware, (req: AuthRequest, res) => {
  try {
    const match = db.matches.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status !== 'open') {
      return res.status(400).json({ error: 'Match is not open' });
    }

    if (match.team2) {
      return res.status(400).json({ error: 'Match is already full' });
    }

    if (match.team1.players.includes(req.userId!)) {
      return res.status(400).json({ error: 'You are already in this match' });
    }

    const user = db.users.findById(req.userId!);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { teamName } = req.body;

    const updatedMatch = db.matches.update(match.id, {
      team2: {
        id: randomUUID(),
        name: teamName || user.teamName || user.username,
        players: [user.id]
      },
      status: 'in-progress'
    });

    res.json({ match: updatedMatch });
  } catch (error) {
    console.error('Join match error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Report map result
router.post('/:id/report', authMiddleware, (req: AuthRequest, res) => {
  try {
    const match = db.matches.findById(req.params.id);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status !== 'in-progress') {
      return res.status(400).json({ error: 'Match is not in progress' });
    }

    if (!match.team1.players.includes(req.userId!) && 
        (!match.team2 || !match.team2.players.includes(req.userId!))) {
      return res.status(403).json({ error: 'You are not in this match' });
    }

    const { mapResults }: { mapResults: MapResult[] } = req.body;

    if (!mapResults || !Array.isArray(mapResults)) {
      return res.status(400).json({ error: 'Invalid map results' });
    }

    // Calculate winner
    let team1Wins = 0;
    let team2Wins = 0;

    mapResults.forEach(result => {
      if (result.winner === 'team1') team1Wins++;
      if (result.winner === 'team2') team2Wins++;
    });

    const matchWinner = team1Wins > team2Wins ? 'team1' : team2Wins > team1Wins ? 'team2' : undefined;

    // Update user stats
    if (matchWinner) {
      const winningTeam = matchWinner === 'team1' ? match.team1 : match.team2!;
      const losingTeam = matchWinner === 'team1' ? match.team2! : match.team1;

      winningTeam.players.forEach(playerId => {
        const player = db.users.findById(playerId);
        if (player) {
          db.users.update(playerId, { wins: player.wins + 1 });
        }
      });

      losingTeam.players.forEach(playerId => {
        const player = db.users.findById(playerId);
        if (player) {
          db.users.update(playerId, { losses: player.losses + 1 });
        }
      });
    }

    const updatedMatch = db.matches.update(match.id, {
      mapResults,
      status: 'completed',
      winner: matchWinner,
      completedAt: new Date()
    });

    res.json({ match: updatedMatch });
  } catch (error) {
    console.error('Report match error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;

