import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedMatches() {
  const DB_DIR = path.join(process.cwd(), 'data');
  const MATCHES_FILE = path.join(DB_DIR, 'matches.json');
  const USERS_FILE = path.join(DB_DIR, 'users.json');

  // Ensure data directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  // Read existing users
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const testUser = users.find(u => u.email === 'test@gamebattles.com');
  
  if (!testUser) {
    console.log('Error: Test user not found. Please run seed.mjs first.');
    return;
  }

  // Initialize matches file if it doesn't exist
  if (!fs.existsSync(MATCHES_FILE)) {
    fs.writeFileSync(MATCHES_FILE, JSON.stringify([]));
  }

  const matches = JSON.parse(fs.readFileSync(MATCHES_FILE, 'utf-8'));

  // MW2 maps
  const mw2Maps = ['Terminal', 'Highrise', 'Rust', 'Favela', 'Scrapyard', 'Afghan', 'Skidrow'];
  
  // Sample matches
  const sampleMatches = [
    {
      id: randomUUID(),
      gameTitle: 'Modern Warfare 2',
      gameMode: 'Search and Destroy',
      bestOf: 3,
      team1: {
        id: randomUUID(),
        name: 'OpTic Gaming',
        players: [randomUUID()]
      },
      maps: ['Terminal', 'Highrise', 'Rust'],
      mapResults: [],
      status: 'open',
      createdBy: randomUUID(),
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    {
      id: randomUUID(),
      gameTitle: 'Black Ops',
      gameMode: 'Capture the Flag',
      bestOf: 3,
      team1: {
        id: randomUUID(),
        name: 'FaZe Clan',
        players: [randomUUID()]
      },
      maps: ['Summit', 'Firing Range', 'Nuketown'],
      mapResults: [],
      status: 'open',
      createdBy: randomUUID(),
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
    },
    {
      id: randomUUID(),
      gameTitle: 'Modern Warfare 2',
      gameMode: 'Domination',
      bestOf: 1,
      team1: {
        id: randomUUID(),
        name: 'Elite Squad',
        players: [testUser.id]
      },
      maps: ['Favela'],
      mapResults: [],
      status: 'open',
      createdBy: testUser.id,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() // 30 minutes ago
    },
    {
      id: randomUUID(),
      gameTitle: 'Modern Warfare 2',
      gameMode: 'Search and Destroy',
      bestOf: 3,
      team1: {
        id: randomUUID(),
        name: 'Team Envy',
        players: [randomUUID()]
      },
      team2: {
        id: randomUUID(),
        name: 'Complexity',
        players: [randomUUID()]
      },
      maps: ['Terminal', 'Scrapyard', 'Afghan'],
      mapResults: [],
      status: 'in-progress',
      createdBy: randomUUID(),
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
    },
    {
      id: randomUUID(),
      gameTitle: 'Black Ops',
      gameMode: 'Team Deathmatch',
      bestOf: 3,
      team1: {
        id: randomUUID(),
        name: '100 Thieves',
        players: [randomUUID()]
      },
      team2: {
        id: randomUUID(),
        name: 'Sentinels',
        players: [randomUUID()]
      },
      maps: ['Jungle', 'Array', 'Crisis'],
      mapResults: [
        { mapName: 'Jungle', team1Score: 75, team2Score: 68, winner: 'team1' },
        { mapName: 'Array', team1Score: 65, team2Score: 75, winner: 'team2' },
        { mapName: 'Crisis', team1Score: 75, team2Score: 72, winner: 'team1' }
      ],
      status: 'completed',
      winner: 'team1',
      createdBy: randomUUID(),
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      completedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: randomUUID(),
      gameTitle: 'Modern Warfare 2',
      gameMode: 'Search and Destroy',
      bestOf: 5,
      team1: {
        id: randomUUID(),
        name: 'Cloud9',
        players: [randomUUID()]
      },
      maps: ['Terminal', 'Highrise', 'Rust', 'Favela', 'Scrapyard'],
      mapResults: [],
      status: 'open',
      createdBy: randomUUID(),
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() // 10 minutes ago
    },
    {
      id: randomUUID(),
      gameTitle: 'Modern Warfare 3',
      gameMode: 'Capture the Flag',
      bestOf: 3,
      team1: {
        id: randomUUID(),
        name: 'NRG Esports',
        players: [randomUUID()]
      },
      maps: ['Dome', 'Arkaden', 'Hardhat'],
      mapResults: [],
      status: 'open',
      createdBy: randomUUID(),
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45 minutes ago
    },
    {
      id: randomUUID(),
      gameTitle: 'Black Ops 2',
      gameMode: 'Domination',
      bestOf: 3,
      team1: {
        id: randomUUID(),
        name: 'TSM',
        players: [randomUUID()]
      },
      maps: ['Standoff', 'Raid', 'Slums'],
      mapResults: [],
      status: 'open',
      createdBy: randomUUID(),
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString() // 90 minutes ago
    }
  ];

  // Add sample matches
  matches.push(...sampleMatches);
  fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2));
  
  console.log('✅ Sample matches created successfully!\n');
  console.log('═══════════════════════════════════');
  console.log(`📊 Total matches: ${sampleMatches.length}`);
  console.log(`🟢 Open matches: ${sampleMatches.filter(m => m.status === 'open').length}`);
  console.log(`🟡 In-progress: ${sampleMatches.filter(m => m.status === 'in-progress').length}`);
  console.log(`🔵 Completed: ${sampleMatches.filter(m => m.status === 'completed').length}`);
  console.log('═══════════════════════════════════\n');
  console.log('Visit http://localhost:3002/matches to see them!\n');
}

seedMatches().catch(console.error);

