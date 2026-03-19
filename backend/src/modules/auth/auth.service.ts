import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';

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
}
