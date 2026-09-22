import { SetEntity } from "../../entity/set.entity";
import { UserResponseDto } from "../../../users/dto/user.response.dto";
import { CardDetailsResponseDto } from "../card/details.response.dto";
import { TopicResponseDto } from "../topic/response.dto";
import { EnglishLevelResponseDto } from "../english-level/response.dto";

export class SetDetailsResponseDto {
  id: string;
  name: string;
  description: string;
  topics: TopicResponseDto[];
  englishLevel: EnglishLevelResponseDto | null;
  user: UserResponseDto;
  cards: CardDetailsResponseDto[];

  constructor(entity: SetEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.topics = entity.topics
      .slice()
      .sort((left, right) => left.position - right.position)
      .map(topic => new TopicResponseDto(topic));
    this.englishLevel = entity.englishLevel
      ? new EnglishLevelResponseDto(entity.englishLevel)
      : null;
    this.user = new UserResponseDto(entity.user);
    this.cards = entity.cards.map(card => new CardDetailsResponseDto(card));
  }
}
