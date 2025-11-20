import { User } from '../models/User';
import { Match } from '../models/Match';
import fs from 'fs';
import path from 'path';

// Simple file-based database for this demo
// In production, you'd use PostgreSQL, MongoDB, etc.

const DB_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DB_DIR, 'users.json');
const MATCHES_FILE = path.join(DB_DIR, 'matches.json');

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initialize files if they don't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]));
}
if (!fs.existsSync(MATCHES_FILE)) {
  fs.writeFileSync(MATCHES_FILE, JSON.stringify([]));
}

export const db = {
  users: {
    getAll: (): User[] => {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    },
    save: (users: User[]) => {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    },
    findById: (id: string): User | undefined => {
      const users = db.users.getAll();
      return users.find(u => u.id === id);
    },
    findByEmail: (email: string): User | undefined => {
      const users = db.users.getAll();
      return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    },
    findByUsername: (username: string): User | undefined => {
      const users = db.users.getAll();
      return users.find(u => u.username.toLowerCase() === username.toLowerCase());
    },
    create: (user: User): User => {
      const users = db.users.getAll();
      users.push(user);
      db.users.save(users);
      return user;
    },
    update: (id: string, updates: Partial<User>): User | null => {
      const users = db.users.getAll();
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return null;
      users[index] = { ...users[index], ...updates };
      db.users.save(users);
      return users[index];
    }
  },
  matches: {
    getAll: (): Match[] => {
      const data = fs.readFileSync(MATCHES_FILE, 'utf-8');
      return JSON.parse(data);
    },
    save: (matches: Match[]) => {
      fs.writeFileSync(MATCHES_FILE, JSON.stringify(matches, null, 2));
    },
    findById: (id: string): Match | undefined => {
      const matches = db.matches.getAll();
      return matches.find(m => m.id === id);
    },
    create: (match: Match): Match => {
      const matches = db.matches.getAll();
      matches.push(match);
      db.matches.save(matches);
      return match;
    },
    update: (id: string, updates: Partial<Match>): Match | null => {
      const matches = db.matches.getAll();
      const index = matches.findIndex(m => m.id === id);
      if (index === -1) return null;
      matches[index] = { ...matches[index], ...updates };
      db.matches.save(matches);
      return matches[index];
    },
    getOpen: (): Match[] => {
      const matches = db.matches.getAll();
      return matches.filter(m => m.status === 'open');
    },
    getUserMatches: (userId: string): Match[] => {
      const matches = db.matches.getAll();
      return matches.filter(m => 
        m.team1.players.includes(userId) || 
        (m.team2 && m.team2.players.includes(userId))
      );
    }
  }
};

