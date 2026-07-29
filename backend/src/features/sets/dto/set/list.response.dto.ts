import { PaginatedResponseDto } from "../../../../common/dto/pagination.response.dto";
import { SetListItemResponseDto } from "./list-item.response.dto";

export class SetListResponseDto extends PaginatedResponseDto(
  SetListItemResponseDto,
) {}
