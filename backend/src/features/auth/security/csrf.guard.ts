import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { Request } from "express";
import { CSRF_COOKIE } from "../auth.constants";
import { getCookie, safeEqual } from "../auth.utils";

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext) {
    if (context.getType() !== "http") return true;

    const request = context.switchToHttp().getRequest<Request>();
    const protectedPaths = ["/auth/handoff", "/auth/refresh", "/auth/logout"];
    if (!protectedPaths.some(path => request.path.endsWith(path))) return true;

    const expectedOrigin =
      this.configService.getOrThrow<string>("auth.appOrigin");
    const origin = request.headers.origin;
    if (!origin || origin !== expectedOrigin) {
      throw new ForbiddenException("Invalid request origin");
    }

    const cookieToken = getCookie(request, CSRF_COOKIE);
    const headerToken = request.headers["x-csrf-token"];
    if (
      !cookieToken ||
      typeof headerToken !== "string" ||
      !safeEqual(cookieToken, headerToken)
    ) {
      throw new ForbiddenException("Invalid CSRF token");
    }

    return true;
  }
}
