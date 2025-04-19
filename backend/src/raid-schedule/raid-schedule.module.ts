import { Module } from '@nestjs/common';
import { RaidScheduleController } from './raid-schedule.controller';
import { RaidScheduleService } from './raid-schedule.service';

@Module({
  controllers: [RaidScheduleController],
  providers: [RaidScheduleService],
  exports: [RaidScheduleService],
})
export class RaidScheduleModule {}
