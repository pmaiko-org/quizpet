import { CreateCardDto } from "../../cards/dto/create-card.dto";
import { Type } from "class-transformer";
import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  IsUUID,
} from "class-validator";

export class CreateSetDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("4", { each: true })
  topicIds: string[];

  @IsArray()
  @Type(() => CreateCardDto)
  @ValidateNested({ each: true })
  cards: CreateCardDto[];
}
