import { ApiProperty } from "@nestjs/swagger";
import { SetEntity } from "../entity/set.entity";
import { UserResponseDto } from "../../users/dto/user.response.dto";
import { TopicResponseDto } from "./topic.response.dto";

export class SetListItemResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: [TopicResponseDto] })
  topics: TopicResponseDto[];

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty()
  cardsCount: number;

  constructor(entity: SetEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.description = entity.description;
    this.topics = entity.topics.map(topic => new TopicResponseDto(topic));
    this.user = new UserResponseDto(entity.user);
    this.cardsCount = entity.cards?.length ?? 0;
  }
}
