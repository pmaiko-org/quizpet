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
import { AuthService } from "./auth.service";
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
  googleAuthRedirect(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = req.user;

    return res.redirect(
      `/login?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`,
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
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): RefreshTokenResponseDto {
    const payload = this.authService.verifyRefreshToken(
      refreshTokenDto.refreshToken,
    );
    if (!payload) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const accessToken = this.authService.generateAccessToken({
      id: payload.sub,
      email: "",
    } as any);

    return new RefreshTokenResponseDto(accessToken);
  }
}
