import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Simple AI chat responses (you can integrate with OpenAI API if desired)
const getAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();

  // Game-related responses
  if (lowerMessage.includes('how') && (lowerMessage.includes('play') || lowerMessage.includes('work'))) {
    return "To play on GameBattles, create an account, find or create a match, and compete against other players. After the match, report your results!";
  }
  
  if (lowerMessage.includes('create') && lowerMessage.includes('match')) {
    return "To create a match, click 'Create Match' in the navigation menu, select your game, mode, maps, and your team name. Then wait for an opponent to join!";
  }

  if (lowerMessage.includes('map') || lowerMessage.includes('maps')) {
    return "Each game has its own set of maps! Select your game when creating a match to see available maps. You can choose between 1, 3, or 5 maps per match.";
  }

  if (lowerMessage.includes('report') && lowerMessage.includes('result')) {
    return "After completing a match, go to the match details page and click 'Report Results'. Enter the scores for each map. If your opponent disputes, you'll need to provide proof.";
  }

  if (lowerMessage.includes('leaderboard') || lowerMessage.includes('rank')) {
    return "Check out the Leaderboard to see top players! Rankings are based on wins and win rate. Keep winning matches to climb the ranks!";
  }

  if (lowerMessage.includes('game') && (lowerMessage.includes('support') || lowerMessage.includes('available'))) {
    return "We currently support Modern Warfare 2, Black Ops, Modern Warfare 3, and Black Ops 2. Each game has authentic maps and supports multiple game modes!";
  }

  if (lowerMessage.includes('join') && lowerMessage.includes('match')) {
    return "To join an open match, go to 'Find Matches', browse available matches, and click on one to join. Enter your team name and you're ready to compete!";
  }

  if (lowerMessage.includes('win') || lowerMessage.includes('lose')) {
    return "Your wins and losses are tracked on your profile. They're updated automatically when match results are reported. Build your legacy!";
  }

  if (lowerMessage.includes('mode') || lowerMessage.includes('modes')) {
    return "Available game modes include Search and Destroy, Capture the Flag, Domination, and Team Deathmatch. Choose your preferred mode when creating a match!";
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('?')) {
    return "I can help you with: creating matches, finding opponents, reporting results, understanding game modes, checking the leaderboard, and more! What would you like to know?";
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hey there, competitor! 👋 Welcome to GameBattles! How can I assist you today?";
  }

  if (lowerMessage.includes('thank')) {
    return "You're welcome! Good luck in your matches! 🎮";
  }

  // Default response
  return "I'm here to help you with GameBattles! Ask me about creating matches, finding opponents, game modes, maps, reporting results, or the leaderboard. What would you like to know?";
};

// Chat endpoint
router.post('/message', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get AI response
    const response = getAIResponse(message.trim());

    res.json({ 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to process message' });
  }
});

export default router;

