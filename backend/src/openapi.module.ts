import { Module } from "@nestjs/common";
import { AuthController } from "./features/auth/auth.controller";
import { UsersController } from "./features/users/users.controller";
import { SetsController } from "./features/sets/sets.controller";
import { StorageController } from "./features/storage/storage.controller";
import { AuthService } from "./features/auth/auth.service";
import { UsersService } from "./features/users/users.service";
import { SetsService } from "./features/sets/sets.service";
import { StorageService } from "./features/storage/services/storage.service";
import { StorageDbBackupsService } from "./features/storage/services/storage-db-backups.service";

@Module({
  controllers: [
    AuthController,
    UsersController,
    SetsController,
    StorageController,
  ],
  providers: [
    {
      provide: AuthService,
      useValue: {},
    },
    {
      provide: UsersService,
      useValue: {},
    },
    {
      provide: SetsService,
      useValue: {},
    },
    {
      provide: StorageService,
      useValue: {},
    },
    {
      provide: StorageDbBackupsService,
      useValue: {},
    },
  ],
})
export class OpenApiModule {}
