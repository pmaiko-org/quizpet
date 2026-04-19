import { IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateCardDto {
  @Type(() => Number)
  @IsNumber()
  position: number;

  @IsString()
  term: string;

  @IsOptional()
  @IsString()
  termDescription?: string | null;

  @IsString()
  @IsOptional()
  termImageId?: string | null;

  @IsString()
  definition: string;

  @IsString()
  @IsOptional()
  definitionImageId?: string | null;

  @IsString()
  @IsOptional()
  textColor?: string | null;

  @IsString()
  @IsOptional()
  backgroundColor?: string | null;
}
