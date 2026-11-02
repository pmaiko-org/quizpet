import { Request } from "express";
import { IJwtPayload } from "../security/jwt-payload.interface";
import type { UserEntity } from "../../users/user.entity";

export interface IAuthenticatedRequest extends Request {
  user: IJwtPayload;
}

export interface IGoogleAuthRequest extends Request {
  user: UserEntity;
}
