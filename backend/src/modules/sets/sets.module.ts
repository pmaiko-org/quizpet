import { Module } from '@nestjs/common';
import { SetsController } from './sets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetsService } from './sets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Set])],
  controllers: [SetsController],
  providers: [SetsController, SetsService],
})
export class SetsModule {}
