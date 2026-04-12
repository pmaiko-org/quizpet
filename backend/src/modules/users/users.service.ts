import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/user.response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async getMe(userId: string) {
    const data = await this.userRepository.findOne({ where: { id: userId } });
    if (data) return new UserResponseDto(data);
  }
}
