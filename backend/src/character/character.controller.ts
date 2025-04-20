import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto, UpdateCharacterDto } from './dto/character.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.characterService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('main')
  async findMainCharacter(@Request() req) {
    return this.characterService.findMainCharacter(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.characterService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createCharacterDto: CreateCharacterDto) {
    return this.characterService.create(req.user.id, createCharacterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.characterService.update(+id, updateCharacterDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.characterService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/sync')
  async syncWithLostArk(@Param('id') id: string) {
    return this.characterService.syncCharacterWithLostArk(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':character_id/items/:item_name')
  async getCharacterItem(
    @Param('character_id') characterId: string,
    @Param('item_name') itemName: string,
  ) {
    return this.characterService.getCharacterItem(+characterId, itemName);
  }
}
