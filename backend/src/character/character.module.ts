// character.module.ts
import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LostarkService } from '../lostark/lostark.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [CharacterController],
  providers: [CharacterService, LostarkService],
  exports: [CharacterService],
})
export class CharacterModule {}