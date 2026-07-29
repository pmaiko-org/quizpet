import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import configuration, { EnvironmentVariables } from "./config/configuration";
import { AuthModule } from "./features/auth/auth.module";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { UsersModule } from "./features/users/users.module";
import { SetsModule } from "./features/sets/sets.module";
import { StorageModule } from "./features/storage/storage.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => {
        const db = configService.get("db", { infer: true })!;

        return {
          type: "postgres",
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          entities: [__dirname + "/features/**/*.entity{.ts,.js}"],
          synchronize: true,
          charset: "utf8mb4_unicode_ci",
        };
      },
    }),
    AuthModule,
    UsersModule,
    SetsModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
