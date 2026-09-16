import { Module } from "@nestjs/common";

import { PitanyachkaGateway } from "./pitanyachka.gateway";

@Module({
  providers: [PitanyachkaGateway],
})
export class PitanyachkaModule {}
