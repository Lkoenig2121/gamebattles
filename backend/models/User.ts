export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  teamName?: string;
  wins: number;
  losses: number;
  createdAt: Date;
}

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  teamName?: string;
  wins: number;
  losses: number;
  createdAt: Date;
}

export function sanitizeUser(user: User): UserDTO {
  const { password, ...sanitized } = user;
  return sanitized;
}

