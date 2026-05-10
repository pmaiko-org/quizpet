import { ApiProperty } from "@nestjs/swagger";
import {
  PaginationResponseInterface,
  PaginationMetaInterface,
} from "../interface/pagination.response.interface";

export class PaginationResponseDto<
  T,
> implements PaginationResponseInterface<T> {
  constructor(
    public data: T[],
    public meta: PaginationMetaDto,
  ) {}
}

export class PaginationMetaDto implements PaginationMetaInterface {
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

type Constructor = new (...args: any[]) => object;

export function PaginatedResponseDto<TItem extends Constructor>(
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
