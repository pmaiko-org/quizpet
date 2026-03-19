import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { RefreshTokenPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(profile: any) {
    const { id: googleId, emails, name, photos } = profile;
    let user = await this.userRepository.findOne({ where: { googleId } });

    if (!user) {
      user = this.userRepository.create({
        googleId,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
      });
      await this.userRepository.save(user);
    }

    const token = this.jwtService.sign({ sub: user.id });

    return { user, token };
  }

  generateAccessToken(user: User) {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_SECRET, expiresIn: '1m' },
    );
  }

  generateRefreshToken(user: User) {
    return this.jwtService.sign(
      { sub: user.id, tokenVersion: 'user.tokenVersion' },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '90d' },
    );
  }

  verifyRefreshToken(token: string) {
    try {
      return this.jwtService.verify<RefreshTokenPayload>(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      return null;
    }
  }
}
