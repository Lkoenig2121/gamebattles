import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedTestUser() {
  const DB_DIR = path.join(process.cwd(), 'data');
  const USERS_FILE = path.join(DB_DIR, 'users.json');

  // Ensure data directory exists
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  // Initialize users file if it doesn't exist
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }

  // Read existing users
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  // Check if test user already exists
  const existingUser = users.find(u => u.email.toLowerCase() === 'test@gamebattles.com');
  
  if (existingUser) {
    console.log('Test user already exists!\n');
    console.log('═══════════════════════════════════');
    console.log('📧 Email: test@gamebattles.com');
    console.log('🔑 Password: password123');
    console.log('═══════════════════════════════════\n');
    return;
  }

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const testUser = {
    id: uuidv4(),
    username: 'TestPlayer',
    email: 'test@gamebattles.com',
    password: hashedPassword,
    teamName: 'Elite Squad',
    wins: 15,
    losses: 8,
    createdAt: new Date().toISOString()
  };

  users.push(testUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  
  console.log('✅ Test user created successfully!\n');
  console.log('═══════════════════════════════════');
  console.log('📧 Email: test@gamebattles.com');
  console.log('🔑 Password: password123');
  console.log('👤 Username: TestPlayer');
  console.log('🎮 Team: Elite Squad');
  console.log('📊 Record: 15W - 8L');
  console.log('═══════════════════════════════════\n');
  console.log('You can now login at http://localhost:3000/login\n');
}

seedTestUser().catch(console.error);

