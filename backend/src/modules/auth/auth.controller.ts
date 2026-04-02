import {
  UnauthorizedException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
  googleAuthRedirect(@Req() req, @Res() res) {
    const { accessToken, refreshToken } = req.user;

    return res.redirect(
      `/login?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`,
    );
  }

  @Post('refresh')
  refreshToken(@Body('refreshToken') refreshToken: string) {
    const payload = this.authService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.authService.generateAccessToken({
      id: payload.sub,
      email: '',
    } as any);

    return { accessToken };
  }
}
