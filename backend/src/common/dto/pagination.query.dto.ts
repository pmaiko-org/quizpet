import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, Max, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { PaginationQueryInterface } from "../interface/pagination.query.interface";

export class PaginationQueryDto implements PaginationQueryInterface {
  @ApiPropertyOptional({ type: Number, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ type: Number, default: 20, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  perPage: number = 20;
}
