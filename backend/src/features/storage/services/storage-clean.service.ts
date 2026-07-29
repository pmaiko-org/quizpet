import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class StorageCleanService {
  private readonly logger = new Logger(StorageCleanService.name);

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCron() {
    this.logger.debug("CronExpression.EVERY_DAY_AT_MIDNIGHT");
  }
}
