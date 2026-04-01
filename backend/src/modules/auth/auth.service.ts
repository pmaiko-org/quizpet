import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { RefreshTokenPayload } from './interfaces/jwt-payload.interface';
import { StorageService } from '../storage/services/storage.service';
import { RequestService } from '../../common/request/request.service';
import { StorageFile } from '../storage/storage.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private storageService: StorageService,
    private requestService: RequestService,
  ) {}

  async validateUser(profile: any) {
    const { id: googleId, emails, name, photos } = profile;
    let user = await this.userRepository.findOne({ where: { googleId } });

    if (!user) {
      const picture = photos[0].value;

      let storageFile: StorageFile | undefined = undefined;

      if (picture) {
        const response = await this.requestService.get<ArrayBuffer>(picture, {
          responseType: 'arraybuffer',
        });
        storageFile = await this.storageService.uploadFile({
          originalname: `user-${googleId}`,
          mimetype: response.headers['content-type'],
          size: Number(response.headers['content-length'] ?? 0),
          buffer: Buffer.from(response.data),
        });
      }

      user = this.userRepository.create({
        googleId,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: storageFile,
      });

      await this.userRepository.save(user);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { user, accessToken, refreshToken };
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

  verifyRefreshToken(refreshToken: string) {
    try {
      return this.jwtService.verify<RefreshTokenPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch {
      return null;
    }
  }
}
