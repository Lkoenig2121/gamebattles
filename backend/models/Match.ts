export type GameMode = 'Search and Destroy' | 'Capture the Flag' | 'Domination' | 'Team Deathmatch';
export type GameTitle = 'Modern Warfare 2' | 'Black Ops' | 'Modern Warfare 3' | 'Black Ops 2';
export type MatchStatus = 'open' | 'in-progress' | 'completed' | 'disputed';

export interface MapResult {
  mapName: string;
  team1Score: number;
  team2Score: number;
  winner?: 'team1' | 'team2';
}

export interface Match {
  id: string;
  gameTitle: GameTitle;
  gameMode: GameMode;
  bestOf: number; // Number of maps (e.g., 3 for best of 3)
  team1: {
    id: string;
    name: string;
    players: string[]; // user IDs
  };
  team2?: {
    id: string;
    name: string;
    players: string[];
  };
  maps: string[]; // List of map names
  mapResults: MapResult[];
  status: MatchStatus;
  winner?: 'team1' | 'team2';
  createdBy: string; // user ID
  createdAt: Date;
  completedAt?: Date;
}

export interface MatchCreateDTO {
  gameTitle: GameTitle;
  gameMode: GameMode;
  bestOf: number;
  team1Name: string;
  maps: string[];
}

