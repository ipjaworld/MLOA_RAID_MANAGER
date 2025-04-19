import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CharacterModule } from './character/character.module';
import { RaidGroupModule } from './raid-group/raid-group.module';
import { RaidScheduleModule } from './raid-schedule/raid-schedule.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    UserModule,
    CharacterModule,
    RaidGroupModule,
    RaidScheduleModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
