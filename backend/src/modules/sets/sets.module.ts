import { Module } from '@nestjs/common';
import { SetsController } from './sets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetsService } from './sets.service';
import { TopicsSeedService } from './topics.seed.service';
import { SetEntity } from './entity/set.entity';
import { TopicEntity } from './entity/topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SetEntity, TopicEntity])],
  controllers: [SetsController],
  providers: [SetsService, TopicsSeedService],
})
export class SetsModule {}
