import { Module } from '@nestjs/common';
import { AuthController } from './modules/auth/auth.controller';
import { UsersController } from './modules/users/users.controller';
import { CardsController } from './modules/cards/cards.controller';
import { SetsController } from './modules/sets/sets.controller';
import { StorageController } from './modules/storage/storage.controller';
import { AuthService } from './modules/auth/auth.service';
import { UsersService } from './modules/users/users.service';
import { CardsService } from './modules/cards/cards.service';
import { SetsService } from './modules/sets/sets.service';
import { StorageService } from './modules/storage/services/storage.service';
import { StorageDbBackupsService } from './modules/storage/services/storage-db-backups.service';

@Module({
  controllers: [
    AuthController,
    UsersController,
    CardsController,
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
      provide: CardsService,
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
