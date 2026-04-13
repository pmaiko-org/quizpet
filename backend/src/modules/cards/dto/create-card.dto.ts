import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCardDto {
  @Type(() => Number)
  @IsNumber()
  position: number;

  @IsString()
  term: string;

  @IsOptional()
  @IsString()
  termDescription?: string;

  @IsString()
  @IsOptional()
  termImageId?: string;

  @IsString()
  definition: string;

  @IsString()
  @IsOptional()
  definitionImageId?: string;

  @IsString()
  @IsOptional()
  textColor?: string;

  @IsString()
  @IsOptional()
  backgroundColor?: string;
}
