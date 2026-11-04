import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { SetsModule } from "../sets/sets.module";
import { McpHttpService } from "./mcp-http.service";
import { OAuthInteractionController } from "./oauth/oauth-interaction.controller";
import { OAuthProviderService } from "./oauth/oauth-provider.service";

@Module({
  imports: [AuthModule, SetsModule],
  controllers: [OAuthInteractionController],
  providers: [McpHttpService, OAuthProviderService],
  exports: [McpHttpService],
})
export class McpModule {}
