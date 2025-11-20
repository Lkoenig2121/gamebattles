const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface User {
  id: string;
  username: string;
  email: string;
  teamName?: string;
  wins: number;
  losses: number;
  createdAt: Date;
}

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
  bestOf: number;
  team1: {
    id: string;
    name: string;
    players: string[];
  };
  team2?: {
    id: string;
    name: string;
    players: string[];
  };
  maps: string[];
  mapResults: MapResult[];
  status: MatchStatus;
  winner?: 'team1' | 'team2';
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
}

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const authAPI = {
  register: async (username: string, email: string, password: string, teamName?: string) => {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, teamName }),
    });
  },

  login: async (email: string, password: string) => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return fetchAPI('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async (): Promise<{ user: User }> => {
    return fetchAPI('/auth/me');
  },
};

export const matchAPI = {
  getAll: async (): Promise<{ matches: Match[] }> => {
    return fetchAPI('/matches');
  },

  getOpen: async (): Promise<{ matches: Match[] }> => {
    return fetchAPI('/matches/open');
  },

  getMyMatches: async (): Promise<{ matches: Match[] }> => {
    return fetchAPI('/matches/my-matches');
  },

  getById: async (id: string): Promise<{ match: Match }> => {
    return fetchAPI(`/matches/${id}`);
  },

  create: async (data: {
    gameTitle: GameTitle;
    gameMode: GameMode;
    bestOf: number;
    team1Name: string;
    maps: string[];
  }): Promise<{ match: Match }> => {
    return fetchAPI('/matches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  join: async (id: string, teamName?: string): Promise<{ match: Match }> => {
    return fetchAPI(`/matches/${id}/join`, {
      method: 'POST',
      body: JSON.stringify({ teamName }),
    });
  },

  reportResults: async (id: string, mapResults: MapResult[]): Promise<{ match: Match }> => {
    return fetchAPI(`/matches/${id}/report`, {
      method: 'POST',
      body: JSON.stringify({ mapResults }),
    });
  },
};

