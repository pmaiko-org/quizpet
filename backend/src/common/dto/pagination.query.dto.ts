import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, Min, Max, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import {
  PAGINATION_DEFAULT_PAGE,
  PAGINATION_DEFAULT_PER_PAGE,
  PAGINATION_MAX_PER_PAGE,
} from "../constants/pagination.constants";
import { IPaginationQuery } from "../interface/pagination.query.interface";

export class PaginationQueryDto implements IPaginationQuery {
  @ApiPropertyOptional({
    type: Number,
    default: PAGINATION_DEFAULT_PAGE,
    minimum: PAGINATION_DEFAULT_PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGINATION_DEFAULT_PAGE)
  page: number = PAGINATION_DEFAULT_PAGE;

  @ApiPropertyOptional({
    type: Number,
    default: PAGINATION_DEFAULT_PER_PAGE,
    minimum: 1,
    maximum: PAGINATION_MAX_PER_PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION_MAX_PER_PAGE)
  perPage: number = PAGINATION_DEFAULT_PER_PAGE;
}
