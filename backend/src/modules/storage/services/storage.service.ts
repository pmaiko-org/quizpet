import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { StorageFileEntity } from "../storage-file.entity";
import { StorageFsService } from "./storage-fs.service";
import * as mime from "mime-types";
import { InjectRepository } from "@nestjs/typeorm";
import { FileResponseDto } from "../dto/file.response.dto";
import { SuccessResponseDto } from "../../../common/dto/success.response.dto";

@Injectable()
export class StorageService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(StorageFileEntity)
    private readonly storageFileRepository: Repository<StorageFileEntity>,
    private readonly fsService: StorageFsService,
  ) {}

  async uploadFile(
    file: Pick<
      Express.Multer.File,
      "originalname" | "mimetype" | "size" | "buffer"
    >,
  ) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const storageFile = queryRunner.manager.create(StorageFileEntity, {
        name: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      const savedFile = await queryRunner.manager.save(storageFile);

      const ext = mime.extension(storageFile.mimetype);

      if (!ext) throw new Error("File extension is not allowed");

      await this.fsService.set(`${savedFile.id}.${ext}`, file.buffer);

      await queryRunner.commitTransaction();
      return new FileResponseDto(savedFile);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getFiles() {
    const storageFiles = await this.storageFileRepository.find();
    return storageFiles.map(file => new FileResponseDto(file));
  }

  async deleteFile(id: string) {
    const storageFile = await this.storageFileRepository.findOneBy({ id });

    if (!storageFile) {
      return new SuccessResponseDto();
    }

    const ext = mime.extension(storageFile.mimetype);

    if (ext) {
      await this.fsService.delete(`${storageFile.id}.${ext}`);
      await this.storageFileRepository.remove(storageFile);
    }

    return new SuccessResponseDto();
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
