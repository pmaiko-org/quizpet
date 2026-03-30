import { Module } from '@nestjs/common';
import { StorageService } from './services/storage.service';
import { StorageController } from './storage.controller';
import { StorageFsService, storagePath } from './services/storage-fs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFile } from './storage.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StorageCleanService } from './services/storage-clean.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageFile]),
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
