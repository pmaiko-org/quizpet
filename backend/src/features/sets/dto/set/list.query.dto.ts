import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";
import { PaginationQueryDto } from "../../../../common/dto/pagination.query.dto";

const toArray = ({ value }: { value: unknown }) => {
  if (Array.isArray(value)) {
    return value;
  }

  return value === undefined ? undefined : [value];
};

export enum SetListScope {
  ALL = "all",
  MINE = "mine",
}

export class SetListQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: SetListScope, default: SetListScope.ALL })
  @IsOptional()
  @IsEnum(SetListScope)
  scope: SetListScope = SetListScope.ALL;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional({ type: [String], format: "uuid" })
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @ArrayMaxSize(50)
  @IsUUID("4", { each: true })
  topicIds?: string[];

  @ApiPropertyOptional({ type: [String], format: "uuid" })
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @ArrayMaxSize(50)
  @IsUUID("4", { each: true })
  englishLevelIds?: string[];

  @ApiPropertyOptional({ type: [String], format: "uuid" })
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @ArrayMaxSize(50)
  @IsUUID("4", { each: true })
  authorIds?: string[];
}
