import { PaginatedResponseDto } from "../../../common/dto/pagination.response.dto";
import { UserResponseDto } from "./user.response.dto";

export class UserListResponseDto extends PaginatedResponseDto(
  UserResponseDto,
) {}
