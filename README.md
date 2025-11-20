# GameBattles - Competitive Gaming Platform

A modern recreation of the classic GameBattles.com website where players can find competitive Call of Duty matches, create tournaments, and compete against skilled opponents.

## 🎮 Features

- **User Authentication** - Secure login and registration system
- **Match Creation** - Create custom matches with various game modes and maps
- **Match Browser** - Find and join open matches
- **Result Reporting** - Report match results and track scores
- **Player Profiles** - View stats including wins, losses, and win rate
- **Multiple Games** - Support for Modern Warfare 2, Black Ops, MW3, and Black Ops 2
- **Game Modes** - Search and Destroy, Capture the Flag, Domination, and Team Deathmatch
- **Best-of Series** - Play best of 1, 3, or 5 map series

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Authentication**: JWT, bcryptjs
- **Database**: File-based JSON storage (easily replaceable with PostgreSQL/MongoDB)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gamebattles
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

### Running the Application

#### Option 1: Run Frontend and Backend Separately

**Terminal 1 - Backend Server:**
```bash
npm run backend
```

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

#### Option 2: Run Both Together
```bash
npm run dev:all
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📖 Usage

### Test Account (Demo)

A test account has been created for you to try out the application:

```
📧 Email: test@gamebattles.com
🔑 Password: password123
👤 Username: TestPlayer
🎮 Team: Elite Squad
📊 Record: 15W - 8L
```

Simply go to http://localhost:3000/login and use these credentials!

### Creating an Account
1. Click "Sign Up" in the navigation bar
2. Enter your username, email, password, and optional team name
3. You'll be automatically logged in after registration

### Creating a Match
1. Navigate to "Create Match" in the menu
2. Select your game title (e.g., Modern Warfare 2)
3. Choose a game mode (Search and Destroy, CTF, etc.)
4. Select best of 1, 3, or 5
5. Choose your maps from the list
6. Enter your team name
7. Click "Create Match"

### Joining a Match
1. Browse open matches on the "Find Matches" page
2. Click on a match to view details
3. Enter your team name
4. Click "Join Match"

### Reporting Results
1. After playing your match, go to the match detail page
2. Click "Report Match Results"
3. Enter scores for each map
4. Submit results - the system will automatically determine the winner

### Viewing Your Stats
1. Click on your username in the top right
2. View your wins, losses, win rate, and match history

## 🎯 Game Configuration

### Supported Games
- Modern Warfare 2 (2009)
- Black Ops
- Modern Warfare 3
- Black Ops 2

### Supported Game Modes
- **Search and Destroy** - Tactical elimination mode
- **Capture the Flag** - Objective-based flag capture
- **Domination** - Control point capture
- **Team Deathmatch** - Classic combat

### Available Maps (Modern Warfare 2)
Afghan, Derail, Estate, Favela, Highrise, Invasion, Karachi, Quarry, Rundown, Rust, Scrapyard, Skidrow, Sub Base, Terminal, Underpass, Wasteland

## 📁 Project Structure

```
gamebattles/
├── app/                      # Next.js app directory
│   ├── create-match/        # Match creation page
│   ├── login/               # Login page
│   ├── matches/             # Match listing and detail pages
│   ├── my-matches/          # User's matches page
│   ├── profile/             # User profile page
│   └── register/            # Registration page
├── backend/                  # Express backend
│   ├── middleware/          # Authentication middleware
│   ├── models/              # Data models
│   ├── routes/              # API routes
│   ├── utils/               # Database utilities
│   └── server.ts            # Express server
├── components/              # React components
│   └── Navbar.tsx          # Navigation component
├── contexts/                # React contexts
│   └── AuthContext.tsx     # Authentication context
├── lib/                     # Utilities
│   └── api.ts              # API client functions
└── data/                    # File-based database (auto-generated)
```

## 🔐 Security Notes

- Change the `JWT_SECRET` in production
- The current implementation uses file-based storage for simplicity
- For production, replace with a proper database (PostgreSQL, MongoDB, etc.)
- Implement rate limiting and input validation for production use

## 🚧 Future Enhancements

- Real-time match notifications
- Team management system
- Tournaments and ladders
- Live chat system
- Admin panel for dispute resolution
- Integration with game APIs
- More games and maps
- Leaderboards and rankings
- Player reputation system

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for the competitive Call of Duty community
