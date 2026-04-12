import { Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { StorageController } from './storage.controller';
import { StorageFsService, storagePath } from './services/storage-fs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFileEntity } from './storage-file.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StorageCleanService } from './services/storage-clean.service';
import { CardEntity } from '../cards/card.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageFileEntity, CardEntity]),
    ServeStaticModule.forRoot({
      rootPath: storagePath,
      serveRoot: storagePath,
      useGlobalPrefix: true,
    }),
  ],
  providers: [StorageService, StorageFsService, StorageCleanService],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
