import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedCompletedMatches() {
  const DB_DIR = path.join(process.cwd(), 'data');
  const MATCHES_FILE = path.join(DB_DIR, 'matches.json');
  const USERS_FILE = path.join(DB_DIR, 'users.json');

  // Read existing users
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const testUser = users.find(u => u.email === 'test@gamebattles.com');
  
  if (!testUser) {
    console.log('Error: Test user not found. Please run seed.mjs first.');
    return;
  }

  const matches = JSON.parse(fs.readFileSync(MATCHES_FILE, 'utf-8'));

  // Create completed matches with the test user
  const completedMatches = [
    // Test user WON these matches
    {
      id: randomUUID(),
      gameTitle: 'Modern Warfare 2',
      gameMode: 'Search and Destroy',
      bestOf: 3,
      team1: {
        id: randomUUID(),
        name: testUser.teamName || 'Elite Squad',
        players: [testUser.id]
      },
      team2: {
        id: randomUUID(),
        name: 'Random Team 1',
        players: [randomUUID()]
      },
      maps: ['Terminal', 'Highrise', 'Rust'],
      mapResults: [
        { mapName: 'Terminal', team1Score: 6, team2Score: 4, winner: 'team1' },
        { mapName: 'Highrise', team1Score: 3, team2Score: 6, winner: 'team2' },
        { mapName: 'Rust', team1Score: 6, team2Score: 2, winner: 'team1' }
      ],
      status: 'completed',
      winner: 'team1',
      createdBy: testUser.id,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
    },
    {
      id: randomUUID(),
      gameTitle: 'Black Ops',
      gameMode: 'Capture the Flag',
      bestOf: 3,
      team1: {
        id: randomUUID(),
        name: testUser.teamName || 'Elite Squad',
        players: [testUser.id]
      },
      team2: {
        id: randomUUID(),
        name: 'Rival Squad',
        players: [randomUUID()]
      },
      maps: ['Summit', 'Firing Range', 'Nuketown'],
      mapResults: [
        { mapName: 'Summit', team1Score: 3, team2Score: 1, winner: 'team1' },
        { mapName: 'Firing Range', team1Score: 3, team2Score: 2, winner: 'team1' }
      ],
      status: 'completed',
      winner: 'team1',
      createdBy: randomUUID(),
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
      completedAt: new Date(Date.now() - 47 * 60 * 60 * 1000).toISOString()
    },
    // Test user LOST these matches
    {
      id: randomUUID(),
      gameTitle: 'Modern Warfare 2',
      gameMode: 'Domination',
      bestOf: 1,
      team1: {
        id: randomUUID(),
        name: 'Pro Team',
        players: [randomUUID()]
      },
      team2: {
        id: randomUUID(),
        name: testUser.teamName || 'Elite Squad',
        players: [testUser.id]
      },
      maps: ['Favela'],
      mapResults: [
        { mapName: 'Favela', team1Score: 200, team2Score: 175, winner: 'team1' }
      ],
      status: 'completed',
      winner: 'team1',
      createdBy: randomUUID(),
      createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
      completedAt: new Date(Date.now() - 35 * 60 * 60 * 1000).toISOString()
    },
    {
      id: randomUUID(),
      gameTitle: 'Black Ops',
      gameMode: 'Team Deathmatch',
      bestOf: 3,
      team1: {
        id: randomUUID(),
        name: 'OpTic Elite',
        players: [randomUUID()]
      },
      team2: {
        id: randomUUID(),
        name: testUser.teamName || 'Elite Squad',
        players: [testUser.id]
      },
      maps: ['Jungle', 'Array', 'Crisis'],
      mapResults: [
        { mapName: 'Jungle', team1Score: 75, team2Score: 68, winner: 'team1' },
        { mapName: 'Array', team1Score: 75, team2Score: 70, winner: 'team1' }
      ],
      status: 'completed',
      winner: 'team1',
      createdBy: randomUUID(),
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      completedAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Add completed matches
  matches.push(...completedMatches);
  fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2));

  // Update test user stats: 2 wins, 2 losses (added to existing stats)
  const updatedUser = {
    ...testUser,
    wins: testUser.wins + 2,
    losses: testUser.losses + 2
  };

  const userIndex = users.findIndex(u => u.id === testUser.id);
  users[userIndex] = updatedUser;
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  
  console.log('✅ Completed matches with test user created!\n');
  console.log('═══════════════════════════════════');
  console.log(`📊 Added ${completedMatches.length} completed matches`);
  console.log(`✅ Wins: +2 matches`);
  console.log(`❌ Losses: +2 matches`);
  console.log(`📈 New record: ${updatedUser.wins}W - ${updatedUser.losses}L`);
  console.log('═══════════════════════════════════\n');
  console.log('Visit http://localhost:3002/profile to see updated stats!\n');
  console.log('Match details:');
  console.log('  ✅ MW2 S&D vs Random Team 1 (Won 2-1)');
  console.log('  ✅ Black Ops CTF vs Rival Squad (Won 2-0)');
  console.log('  ❌ MW2 Dom vs Pro Team (Lost)');
  console.log('  ❌ Black Ops TDM vs OpTic Elite (Lost 0-2)');
  console.log('');
}

seedCompletedMatches().catch(console.error);

