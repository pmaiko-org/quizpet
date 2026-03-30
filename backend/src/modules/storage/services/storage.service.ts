import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { StorageFile } from '../storage.entity';
import { StorageFsService } from './storage-fs.service';
import * as mime from 'mime-types';

@Injectable()
export class StorageService {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly fsService: StorageFsService,
  ) {}

  async uploadFile(
    file: Pick<
      Express.Multer.File,
      'originalname' | 'mimetype' | 'size' | 'buffer'
    >,
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const storageFile = queryRunner.manager.create(StorageFile, {
        name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      const savedFile = await queryRunner.manager.save(storageFile);

      const ext = mime.extension(storageFile.mimetype);

      if (!ext) throw new Error('File extension is not allowed');

      await this.fsService.set(`${savedFile.id}.${ext}`, file.buffer);

      await queryRunner.commitTransaction();
      return savedFile;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

// return await this.entityManager.transaction(async (manager) => {
//   const storageFile = manager.create(StorageFiles, {
//     name: file.originalname,
//     mimetype: file.mimetype,
//     size: file.size,
//   });
//
//   const savedFile = await manager.save(storageFile);
//
//   fileKey = `uploads/${savedFile.id}`;
//   await this.fsService.set(fileKey, file.buffer);
//
//   // throw new Error('failed after file write');
//
//   return savedFile;
// });
