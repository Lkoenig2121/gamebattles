import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';

async function seedTestUser() {
  // Check if test user already exists
  const existingUser = db.users.findByEmail('test@gamebattles.com');
  
  if (existingUser) {
    console.log('Test user already exists!');
    console.log('\n📧 Email: test@gamebattles.com');
    console.log('🔑 Password: password123\n');
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
    createdAt: new Date()
  };

  db.users.create(testUser);
  
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

