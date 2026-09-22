import { Module } from "@nestjs/common";
import { SetsController } from "./sets.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SetsService } from "./sets.service";
import { TopicsSeedService } from "./topics.seed.service";
import { SetEntity } from "./entity/set.entity";
import { TopicEntity } from "./entity/topic.entity";
import { CardEntity } from "./entity/card.entity";
import { EnglishLevelEntity } from "./entity/english-level.entity";
import { EnglishLevelsSeedService } from "./english-levels.seed.service";
import { UserEntity } from "../users/user.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SetEntity,
      TopicEntity,
      CardEntity,
      EnglishLevelEntity,
      UserEntity,
    ]),
  ],
  controllers: [SetsController],
  providers: [SetsService, TopicsSeedService, EnglishLevelsSeedService],
})
export class SetsModule {}
