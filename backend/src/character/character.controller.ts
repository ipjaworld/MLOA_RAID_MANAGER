import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CharacterService } from './character.service';
import {
  CreateCharacterDto,
  UpdateCharacterDto,
  CharacterResponseDto,
} from './dto/character.dto';

@ApiTags('characters')
@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @ApiOperation({ summary: '모든 캐릭터 조회' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: '사용자 ID로 필터링',
  })
  @ApiResponse({
    status: 200,
    description: '캐릭터 목록 조회 성공',
    type: [CharacterResponseDto],
  })
  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.characterService.findAll(userId ? +userId : undefined);
  }

  @ApiOperation({ summary: '캐릭터 상세 조회' })
  @ApiParam({ name: 'id', description: '캐릭터 ID' })
  @ApiResponse({
    status: 200,
    description: '캐릭터 조회 성공',
    type: CharacterResponseDto,
  })
  @ApiResponse({ status: 404, description: '캐릭터를 찾을 수 없음' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.characterService.findOne(+id);
  }

  @ApiOperation({ summary: '캐릭터 생성' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 201,
    description: '캐릭터 생성 성공',
    type: CharacterResponseDto,
  })
  @Post('users/:userId')
  async create(
    @Param('userId') userId: string,
    @Body() createCharacterDto: CreateCharacterDto,
  ) {
    return this.characterService.create(+userId, createCharacterDto);
  }

  @ApiOperation({ summary: '캐릭터 정보 수정' })
  @ApiParam({ name: 'id', description: '캐릭터 ID' })
  @ApiResponse({
    status: 200,
    description: '캐릭터 정보 수정 성공',
    type: CharacterResponseDto,
  })
  @ApiResponse({ status: 404, description: '캐릭터를 찾을 수 없음' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
  ) {
    return this.characterService.update(+id, updateCharacterDto);
  }

  @ApiOperation({ summary: '캐릭터 삭제' })
  @ApiParam({ name: 'id', description: '캐릭터 ID' })
  @ApiResponse({ status: 204, description: '캐릭터 삭제 성공' })
  @ApiResponse({ status: 404, description: '캐릭터를 찾을 수 없음' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.characterService.remove(+id);
  }
}
