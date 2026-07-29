import { IsOptional, IsUUID } from "class-validator";
import { CardCreateDto } from "./create.dto";

export class CardUpdateDto extends CardCreateDto {
  @IsUUID("4")
  @IsOptional()
  id?: string | null;
}
