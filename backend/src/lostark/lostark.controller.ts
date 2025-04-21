import { Controller, Get, Param } from '@nestjs/common';
import { LostarkService } from './lostark.service';

@Controller('lostark')
export class LostarkController {
  constructor(private readonly lostarkService: LostarkService) {}

  @Get('character/:name')
  async getCharacter(@Param('name') name: string) {
    return this.lostarkService.getCharacter(name);
  }

  @Get('character/:name/profile')
  async getCharacterProfile(@Param('name') name: string) {
    return this.lostarkService.getCharacterProfile(name);
  }

  @Get('character/:name/equipment')
  async getCharacterEquipment(@Param('name') name: string) {
    return this.lostarkService.getCharacterEquipment(name);
  }

  @Get('character/:name/basic')
  async getCharacterBasicInfo(@Param('name') name: string) {
    return this.lostarkService.getCharacterBasicInfo(name);
  }
}
