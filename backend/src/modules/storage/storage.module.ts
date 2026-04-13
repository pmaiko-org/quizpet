import { Module } from '@nestjs/common';
import { STORAGE_PATH } from '../../config/constants';
import { StorageService } from './services/storage.service';
import { StorageController } from './storage.controller';
import { StorageFsService } from './services/storage-fs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFileEntity } from './storage-file.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { StorageCleanService } from './services/storage-clean.service';
import { StorageDbBackupsService } from './services/storage-db-backups.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageFileEntity]),
    ServeStaticModule.forRoot({
      rootPath: STORAGE_PATH,
      serveRoot: STORAGE_PATH,
      useGlobalPrefix: true,
    }),
  ],
  providers: [
    StorageService,
    StorageFsService,
    StorageCleanService,
    StorageDbBackupsService,
  ],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
