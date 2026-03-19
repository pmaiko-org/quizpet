export interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  sub: number;
  tokenVersion: number;
  iat?: number;
  exp?: number;
}
