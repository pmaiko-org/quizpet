import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration, { EnvironmentVariables } from './config/configuration';
import { AuthModule } from './modules/auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './modules/users/users.module';
import { CardsModule } from './modules/cards/cards.module';
import { SetsService } from './modules/sets/sets.service';
import { SetsModule } from './modules/sets/sets.module';
import { StorageModule } from './modules/storage/storage.module';
import { ScheduleModule } from '@nestjs/schedule';

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
        const db = configService.get('db', { infer: true })!;

        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
          synchronize: true,
          charset: 'utf8mb4_unicode_ci',
        };
      },
    }),
    AuthModule,
    UsersModule,
    CardsModule,
    SetsModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService, SetsService],
})
export class AppModule {}
