import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return req.user; // { user, token }
  }

  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    const payload = this.authService.verifyRefreshToken(refreshToken);
    if (!payload) return { error: 'Invalid refresh token' };

    const accessToken = this.authService.generateAccessToken({
      id: payload.sub,
      email: '',
    } as any);

    return { accessToken };
  }
}
