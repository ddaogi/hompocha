import { Module } from '@nestjs/common';
import { OpenviduModule } from './openvidu/openvidu.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users/users.entity';
import { RoomsModule } from './rooms/rooms.module';
import { RoomsEntity } from './rooms/rooms.entity';
import * as dotenv from 'dotenv';
import path from 'path';

import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 이를 설정하면 다른 모듈에서 ConfigService를 import하지 않고도 환경 변수에 접근할 수 있습니다.
      envFilePath: `${__dirname}/config/env/.${process.env.NODE_ENV}.env`, // NODE_ENV에 따라 다른 .env 파일을 사용합니다.
    }),
    OpenviduModule,
    UsersModule,
    RoomsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: 3306,
        username: 'admin',
        password: 'hompocha229',
        database: 'test_db',
        entities: [UsersEntity, RoomsEntity],
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule {}
