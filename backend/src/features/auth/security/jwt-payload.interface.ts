export interface IJwtPayload {
  sub: string;
  sid: string;
  type: "access";
  iat?: number;
  exp?: number;
}

export interface IRefreshTokenPayload {
  sub: string;
  sid: string;
  jti: string;
  type: "refresh";
  iat?: number;
  exp?: number;
}
