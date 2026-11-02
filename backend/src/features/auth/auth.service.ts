import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Profile } from "passport-google-oauth20";
import { Repository } from "typeorm";
import { RequestService } from "../../common/request/request.service";
import { FileResponseDto } from "../storage/dto/file.response.dto";
import { StorageService } from "../storage/services/storage.service";
import { UserEntity } from "../users/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly storageService: StorageService,
    private readonly requestService: RequestService,
  ) {}

  async validateGoogleUser(profile: Profile) {
    const email = profile.emails?.[0]?.value.trim().toLowerCase();
    if (!email) throw new UnauthorizedException("Google account has no email");

    let user = await this.userRepository.findOne({
      where: [{ googleId: profile.id }, { email }],
    });

    if (user) {
      if (user.googleId !== profile.id) {
        user.googleId = profile.id;
        user = await this.userRepository.save(user);
      }
      return user;
    }

    const picture = profile.photos?.[0]?.value;
    let storageFile: FileResponseDto | undefined;

    if (picture) {
      try {
        const response = await this.requestService.get<ArrayBuffer>(picture, {
          responseType: "arraybuffer",
        });
        storageFile = await this.storageService.uploadFile({
          originalname: `user-${profile.id}`,
          mimetype: String(response.headers["content-type"] ?? ""),
          size: Number(response.headers["content-length"] ?? 0),
          buffer: Buffer.from(response.data),
        });
      } catch {
        storageFile = undefined;
      }
    }

    return this.userRepository.save(
      this.userRepository.create({
        googleId: profile.id,
        email,
        firstName: profile.name?.givenName || "unknown",
        lastName: profile.name?.familyName || "unknown",
        picture: storageFile?.id ? { id: storageFile.id } : undefined,
      }),
    );
  }

  async getUser(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException("User not found");
    return user;
  }
}
