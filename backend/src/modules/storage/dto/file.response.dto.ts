import { StorageFileEntity } from "../storage-file.entity";
import * as mime from "mime-types";
import { GLOBAL_PREFIX, STORAGE_PATH } from "../../../config/constants";

export class FileResponseDto {
  id: string;
  src: string;
  name: string;

  constructor(entity: StorageFileEntity) {
    this.id = entity.id;
    const ext = mime.extension(entity.mimetype);
    this.src = `/${GLOBAL_PREFIX}${STORAGE_PATH}/${entity.id}.${ext}`;
    this.name = entity.name;
  }
}
