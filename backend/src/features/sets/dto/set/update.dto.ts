import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  IsArray,
  IsString,
  IsUUID,
  ValidateNested,
} from "class-validator";
import { CardUpdateDto } from "../card/update.dto";

export class SetUpdateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("4", { each: true })
  topicIds: string[];

  @IsArray()
  @Type(() => CardUpdateDto)
  @ValidateNested({ each: true })
  cards: CardUpdateDto[];
}
