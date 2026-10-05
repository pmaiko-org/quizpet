import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cron, CronExpression } from "@nestjs/schedule";
import { spawn } from "child_process";
import { EnvironmentVariables } from "../../../config/configuration";
import { StorageFsService } from "./storage-fs.service";

type TDatabaseBackupTarget = {
  database: string;
  filePrefix: "db" | "cms";
};

@Injectable()
export class StorageDbBackupsService {
  private readonly logger = new Logger(StorageDbBackupsService.name);
  private readonly backupDirectory = "db-backups";
  private readonly pgDumpBin = process.env.PG_DUMP_BIN || "pg_dump";

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
    private readonly storageFsService: StorageFsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this.createBackup();
  }

  async createBackup() {
    const db = this.configService.get("db", { infer: true });

    if (!db) {
      throw new Error("Database configuration is missing");
    }

    const targets: TDatabaseBackupTarget[] = [
      { database: db.database, filePrefix: "db" },
      { database: db.cmsDatabase, filePrefix: "cms" },
    ];
    const backupDate = new Date();
    const backups: { fileName: string; path: string }[] = [];

    try {
      for (const target of targets) {
        const backupFileName = this.buildBackupFileName(
          target.filePrefix,
          backupDate,
        );
        const path = `${this.backupDirectory}/${backupFileName}`;
        const dump = await this.createDatabaseDump(target.database);

        await this.storageFsService.set(path, dump);
        await this.removeOldBackups(target.filePrefix);

        backups.push({ fileName: backupFileName, path });
        this.logger.log(`Database backup created: ${backupFileName}`);
      }

      const [primaryBackup] = backups;

      return {
        success: true,
        fileName: primaryBackup.fileName,
        path: primaryBackup.path,
        backups,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown backup error";

      this.logger.error(`Database backup failed: ${message}`, error);
      throw error;
    }
  }

  private buildBackupFileName(
    filePrefix: TDatabaseBackupTarget["filePrefix"],
    date: Date,
  ): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${filePrefix}-backup-${year}-${month}-${day}_${hours}-${minutes}-${seconds}.sql`;
  }

  private async createDatabaseDump(database: string): Promise<Buffer> {
    const db = this.configService.get("db", { infer: true });

    if (!db) {
      throw new Error("Database configuration is missing");
    }

    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      const errors: Buffer[] = [];
      const args = [
        "--host",
        db.host,
        "--port",
        String(db.port),
        "--username",
        db.username,
        "--dbname",
        database,
        "--encoding",
        "UTF8",
        "--format=plain",
        "--no-owner",
        "--no-privileges",
      ];

      const dumpProcess = spawn(this.pgDumpBin, args, {
        env: {
          ...process.env,
          PGPASSWORD: db.password,
        },
      });

      dumpProcess.stdout.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      dumpProcess.stderr.on("data", (chunk: Buffer) => {
        errors.push(chunk);
      });

      dumpProcess.on("error", error => {
        reject(
          new Error(
            `Failed to start ${this.pgDumpBin}: ${error.message}. ` +
              "Make sure the PostgreSQL client tools are installed and available in PATH.",
          ),
        );
      });

      dumpProcess.on("close", code => {
        if (code !== 0) {
          const stderr = Buffer.concat(errors).toString("utf8").trim();
          reject(
            new Error(
              stderr ||
                `${this.pgDumpBin} exited with a non-zero code: ${code ?? "null"}`,
            ),
          );
          return;
        }

        resolve(Buffer.concat(chunks));
      });
    });
  }

  private async removeOldBackups(
    filePrefix: TDatabaseBackupTarget["filePrefix"],
  ): Promise<void> {
    const storedFiles = await this.storageFsService.get(this.backupDirectory);

    if (!Array.isArray(storedFiles)) {
      return;
    }

    const backupFilePattern = new RegExp(
      `^${filePrefix}-backup-\\d{4}-\\d{2}-\\d{2}_\\d{2}-\\d{2}-\\d{2}\\.sql$`,
    );
    const backupFiles = storedFiles
      .filter(fileName => backupFilePattern.test(fileName))
      .sort();

    const filesToDelete = backupFiles.slice(
      0,
      Math.max(0, backupFiles.length - 2),
    );

    for (const fileName of filesToDelete) {
      await this.storageFsService.delete(`${this.backupDirectory}/${fileName}`);
      this.logger.log(`Old database backup deleted: ${fileName}`);
    }
  }
}
