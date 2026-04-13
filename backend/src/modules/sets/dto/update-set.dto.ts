import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UpdateCardDto } from '../../cards/dto/update-card.dto';

export class UpdateSetDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  topicIds: string[];

  @IsArray()
  @Type(() => UpdateCardDto)
  @ValidateNested({ each: true })
  cards: UpdateCardDto[];
}
