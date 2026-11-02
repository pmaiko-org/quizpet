import { IsString, Length } from "class-validator";

export class OAuthHandoffDto {
  @IsString()
  @Length(32, 128)
  code: string;
}
