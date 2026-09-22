import { ApiProperty } from "@nestjs/swagger";
import {
  IPaginationResponse,
  IPaginationMeta,
} from "../interface/pagination.response.interface";

export class PaginationResponseDto<T> implements IPaginationResponse<T> {
  constructor(
    public data: T[],
    public meta: PaginationMetaDto,
  ) {}
}

export class PaginationMetaDto implements IPaginationMeta {
  @ApiProperty()
  page: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  pages: number;

  constructor(page: number, perPage: number, total: number, pages: number) {
    this.page = page;
    this.perPage = perPage;
    this.total = total;
    this.pages = pages;
  }
}

type TConstructor = new (...args: any[]) => object;

export function PaginatedResponseDto<TItem extends TConstructor>(
  ItemDto: TItem,
) {
  class PaginatedDto extends PaginationResponseDto<InstanceType<TItem>> {
    @ApiProperty({ type: [ItemDto] })
    declare data: InstanceType<TItem>[];

    @ApiProperty({ type: PaginationMetaDto })
    declare meta: PaginationMetaDto;
  }
  return PaginatedDto;
}
