import { IsIn, IsString } from "class-validator";

export class OAuthConsentDto {
  @IsIn(["allow", "deny"])
  decision: "allow" | "deny";

  @IsString()
  csrfToken: string;
}
