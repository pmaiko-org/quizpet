import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateProfileDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsUUID("4")
  avatarFileId?: string | null;
}
