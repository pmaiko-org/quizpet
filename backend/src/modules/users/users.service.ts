import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { UserResponseDto } from "./dto/user.response.dto";
import { AbstractService } from "../../common/abstract.service";
import { UserListQueryDto } from "./dto/user-list.query.dto";
import { UserListResponseDto } from "./dto/user-list.response.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { StorageFileEntity } from "../storage/storage-file.entity";
import { SetEntity } from "../sets/entity/set.entity";
import { ProfileStatsResponseDto } from "./dto/profile-stats.response.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(StorageFileEntity)
    private storageFileRepository: Repository<StorageFileEntity>,
    @InjectRepository(SetEntity)
    private setRepository: Repository<SetEntity>,
  ) {}

  async getMe(userId: string) {
    const data = await this.userRepository.findOne({ where: { id: userId } });
    if (data) return new UserResponseDto(data);
  }

  async getUsers(query: UserListQueryDto): Promise<UserListResponseDto> {
    return new AbstractService(this.userRepository, UserResponseDto).paginate(
      query,
    );
  }

  async getMyStats(userId: string): Promise<ProfileStatsResponseDto> {
    const [peopleCount, mySetsCount, rawTopicsCount] = await Promise.all([
      this.userRepository.count(),
      this.setRepository.count({
        where: { user: { id: userId } },
      }),
      this.setRepository
        .createQueryBuilder("set")
        .leftJoin("set.topics", "topic")
        .where("set.userId = :userId", { userId })
        .select("COUNT(DISTINCT topic.id)", "count")
        .getRawOne<{ count: string }>(),
    ]);

    return new ProfileStatsResponseDto({
      peopleCount,
      mySetsCount,
      myTopicsCount: Number(rawTopicsCount?.count ?? 0),
    });
  }

  async updateMe(
    userId: string,
    body: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    let picture = user.picture ?? null;

    if (body.avatarFileId !== undefined) {
      if (body.avatarFileId === null) {
        picture = null;
      } else {
        picture = await this.storageFileRepository.findOneBy({
          id: body.avatarFileId,
        });

        if (!picture) {
          throw new BadRequestException("Avatar file not found");
        }
      }
    }

    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.picture = picture;

    await this.userRepository.save(user);

    return (await this.getMe(userId)) as UserResponseDto;
  }
}
