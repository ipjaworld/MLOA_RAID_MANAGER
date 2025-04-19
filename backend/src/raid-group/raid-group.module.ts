import { Module } from '@nestjs/common';
import { RaidGroupController } from './raid-group.controller';
import { RaidGroupService } from './raid-group.service';

@Module({
  controllers: [RaidGroupController],
  providers: [RaidGroupService],
  exports: [RaidGroupService],
})
export class RaidGroupModule {}
