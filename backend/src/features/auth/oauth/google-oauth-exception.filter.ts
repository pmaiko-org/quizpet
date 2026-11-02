import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import type { Response } from "express";

@Catch()
export class GoogleOAuthExceptionFilter implements ExceptionFilter {
  catch(_exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.redirect("/login?error=google_auth_failed");
  }
}
