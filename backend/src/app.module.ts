import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CharacterModule } from './character/character.module';
import { RaidGroupModule } from './raid-group/raid-group.module';
import { RaidScheduleModule } from './raid-schedule/raid-schedule.module';
import { ScheduleModule } from './schedule/schedule.module';
import { PrismaModule } from './prisma/prisma.module';
import { LostarkService } from './lostark/lostark.service';
import { LostarkController } from './lostark/lostark.controller';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    CharacterModule,
    RaidGroupModule,
    RaidScheduleModule,
    ScheduleModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, LostarkController],
  providers: [AppService, LostarkService],
})
export class AppModule {}
