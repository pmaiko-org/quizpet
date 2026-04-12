import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/user.entity';
import { RefreshTokenPayload } from './interfaces/jwt-payload.interface';
import { StorageService } from '../storage/services/storage.service';
import { RequestService } from '../../common/request/request.service';
import { StorageFileEntity } from '../storage/storage-file.entity';
import { FileResponseDto } from '../storage/dto/file.response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private storageService: StorageService,
    private requestService: RequestService,
  ) {}

  async validateUser(profile: any) {
    const { id: googleId, emails, name, photos } = profile;
    let user = await this.userRepository.findOne({ where: { googleId } });

    if (!user) {
      const picture = photos[0].value;

      let storageFile: FileResponseDto | undefined = undefined;

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
        picture: storageFile?.id ? { id: storageFile?.id } : undefined,
      });

      await this.userRepository.save(user);
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return { user, accessToken, refreshToken };
  }

  generateAccessToken(user: UserEntity) {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: process.env.JWT_SECRET, expiresIn: '5d' },
    );
  }

  generateRefreshToken(user: UserEntity) {
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
