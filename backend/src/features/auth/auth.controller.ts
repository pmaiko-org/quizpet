import {
  UnauthorizedException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Response } from "express";
import { AuthService } from "./auth.service";
import type { GoogleAuthRequest } from "./interfaces/authenticated-request.interface";
import { RefreshTokenResponseDto } from "./dto/refresh-token.response.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {}

  @Get("google/redirect")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req: GoogleAuthRequest, @Res() res: Response) {
    const { accessToken, refreshToken } = req.user;

    return res.redirect(
      `/login#accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`,
    );
  }

  @Post("refresh")
  @UsePipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: errors => {
        return new UnauthorizedException({
          message: "Validation failed",
          errors: errors.map(error => ({
            field: error.property,
            constraints: error.constraints,
          })),
        });
      },
    }),
  )
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    const accessToken = await this.authService.refreshAccessToken(
      refreshTokenDto.refreshToken,
    );

    if (!accessToken) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    return new RefreshTokenResponseDto(accessToken);
  }
}
