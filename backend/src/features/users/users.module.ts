import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { StorageFileEntity } from "../storage/storage-file.entity";
import { SetEntity } from "../sets/entity/set.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, StorageFileEntity, SetEntity]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
