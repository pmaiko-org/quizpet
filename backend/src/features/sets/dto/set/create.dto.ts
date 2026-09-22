import { CardCreateDto } from "../card/create.dto";
import { Type } from "class-transformer";
import {
  IsString,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
  IsOptional,
  IsUUID,
} from "class-validator";

export class SetCreateDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID("4", { each: true })
  topicIds: string[];

  @IsOptional()
  @IsUUID("4")
  englishLevelId?: string | null;

  @IsArray()
  @Type(() => CardCreateDto)
  @ValidateNested({ each: true })
  cards: CardCreateDto[];
}
