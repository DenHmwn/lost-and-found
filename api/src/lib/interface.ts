export interface TokenPayload {
  id: string;
  name: string;
  role: string;
}

export interface RefreshPayload {
  id: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}