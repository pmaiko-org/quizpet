import { SetEntity } from '../entity/set.entity';
import { TopicEntity } from '../entity/topic.entity';
import { UserResponseDto } from '../../users/dto/user.response.dto';
import { CardDetailsResponseDto } from '../../cards/dto/card-details.response.dto';

export class SetDetailsResponseDto {
  id: string;
  name: string;
  description: string;
  topics: TopicEntity[];
  user: UserResponseDto;
  cards: CardDetailsResponseDto[];

  constructor(entity: SetEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.topics = entity.topics;
    this.user = new UserResponseDto(entity.user);
    this.cards = entity.cards.map((card) => new CardDetailsResponseDto(card));
  }
}
