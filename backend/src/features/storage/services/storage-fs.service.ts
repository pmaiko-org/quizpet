import { Injectable } from "@nestjs/common";
import path from "path";
import fs, { promises as fsAsync } from "fs";
import { FsException } from "../../../common/exceptions/fs.exception";
import { CHARSET, STORAGE_PATH } from "../../../config/constants";

@Injectable()
export class StorageFsService {
  private readonly storageBasePath: string;

  constructor() {
    this.storageBasePath = STORAGE_PATH;
    this.ensureDirSync(this.storageBasePath);
  }

  private ensureDirSync(dirPath: string): void {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  private async ensureDir(dirPath: string): Promise<void> {
    await fsAsync.mkdir(dirPath, { recursive: true });
  }

  private async pathExists(targetPath: string): Promise<boolean> {
    try {
      await fsAsync.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }

  async set(key: string, data: string | Buffer): Promise<void> {
    try {
      const filePath = path.join(this.storageBasePath, key);
      await this.ensureDir(path.dirname(filePath));

      if (typeof data === "string") {
        await fsAsync.writeFile(filePath, data, CHARSET);
      } else {
        await fsAsync.writeFile(filePath, data as unknown as Uint8Array);
      }
    } catch (error) {
      throw new FsException(`File system failed to set ${key}: ${error}`, {
        cause: error,
      });
    }
  }

  async get(key: string): Promise<string | string[] | null> {
    const filePath = path.join(this.storageBasePath, key);

    try {
      const exists = await this.pathExists(filePath);
      if (!exists) return null;

      const stat = await fsAsync.stat(filePath);
      if (stat.isDirectory()) {
        return fsAsync.readdir(filePath);
      } else {
        const data = await fsAsync.readFile(filePath);
        return data.toString(CHARSET);
      }
    } catch {
      return null;
    }
  }

  async delete(key: string): Promise<{ message: string }> {
    const filePath = path.join(this.storageBasePath, key);

    try {
      const exists = await this.pathExists(filePath);
      if (!exists) {
        return {
          message: `Path ${key} not found.`,
        };
      }

      const stat = await fsAsync.stat(filePath);

      if (stat.isDirectory()) {
        await fsAsync.rm(filePath, { recursive: true, force: true });
        return {
          message: `All files in the ${key} directory have been deleted.`,
        };
      } else {
        await fsAsync.unlink(filePath);
        return {
          message: `The file ${key} has been deleted.`,
        };
      }
    } catch (error) {
      throw new FsException(
        `File system failed to delete ${key}. Error while deleting ${filePath}: ${error}`,
        {
          cause: error,
        },
      );
    }
  }
}
