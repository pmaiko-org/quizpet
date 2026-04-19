import { UserEntity } from "../user.entity";
import { FileResponseDto } from "../../storage/dto/file.response.dto";

export class UserResponseDto {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;

  constructor(entity: UserEntity) {
    this.firstName = entity.firstName;
    this.lastName = entity.lastName;
    this.email = entity.email;

    if (entity.picture) {
      const file = new FileResponseDto(entity.picture);
      this.avatar = file.src;
    }
  }
}
