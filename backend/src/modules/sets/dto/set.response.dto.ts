import { SetEntity } from '../entity/set.entity';
import { TopicEntity } from '../entity/topic.entity';
import { UserResponseDto } from '../../users/dto/user.response.dto';

export class SetResponseDto {
  id: string;
  name: string;
  description: string;
  topics: TopicEntity[];
  user: UserResponseDto;
  cardsCount: number;

  constructor(entity: SetEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.topics = entity.topics;
    this.user = new UserResponseDto(entity.user);
    this.cardsCount = entity.cards?.length ?? 0;
  }
}
