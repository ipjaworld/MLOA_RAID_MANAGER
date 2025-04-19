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
import { RaidScheduleService } from './raid-schedule.service';
import {
  CreateRaidScheduleDto,
  UpdateRaidScheduleDto,
  RaidScheduleResponseDto,
  RaidScheduleDetailResponseDto,
} from './dto/raid-schedule.dto';

@ApiTags('raid-schedules')
@Controller('raid-schedules')
export class RaidScheduleController {
  constructor(private readonly raidScheduleService: RaidScheduleService) {}

  @ApiOperation({ summary: '모든 레이드 일정 조회' })
  @ApiQuery({
    name: 'raidGroupId',
    required: false,
    description: '공격대 ID로 필터링',
  })
  @ApiResponse({
    status: 200,
    description: '레이드 일정 목록 조회 성공',
    type: [RaidScheduleResponseDto],
  })
  @Get()
  async findAll(@Query('raidGroupId') raidGroupId?: string) {
    return this.raidScheduleService.findAll(
      raidGroupId ? +raidGroupId : undefined,
    );
  }

  @ApiOperation({ summary: '레이드 일정 상세 조회' })
  @ApiParam({ name: 'id', description: '레이드 일정 ID' })
  @ApiResponse({
    status: 200,
    description: '레이드 일정 조회 성공',
    type: RaidScheduleDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: '레이드 일정을 찾을 수 없음' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.raidScheduleService.findOne(+id);
  }

  @ApiOperation({ summary: '특정 사용자의 레이드 일정 목록 조회' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: '앞으로 몇 일간의 일정을 조회할지 (기본값: 7)',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 레이드 일정 목록 조회 성공',
    type: [RaidScheduleResponseDto],
  })
  @Get('users/:userId/upcoming')
  async getUpcomingSchedules(
    @Param('userId') userId: string,
    @Query('days') days?: string,
  ) {
    return this.raidScheduleService.getUpcomingSchedules(
      +userId,
      days ? +days : undefined,
    );
  }

  @ApiOperation({ summary: '레이드 일정 생성' })
  @ApiParam({ name: 'raidGroupId', description: '공격대 ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 201,
    description: '레이드 일정 생성 성공',
    type: RaidScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: '공격대를 찾을 수 없음' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @Post('raid-groups/:raidGroupId/users/:userId')
  async create(
    @Param('raidGroupId') raidGroupId: string,
    @Param('userId') userId: string,
    @Body() createRaidScheduleDto: CreateRaidScheduleDto,
  ) {
    return this.raidScheduleService.create(
      +raidGroupId,
      +userId,
      createRaidScheduleDto,
    );
  }

  @ApiOperation({ summary: '레이드 일정 수정' })
  @ApiParam({ name: 'id', description: '레이드 일정 ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '레이드 일정 수정 성공',
    type: RaidScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: '레이드 일정을 찾을 수 없음' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @Put(':id/users/:userId')
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateRaidScheduleDto: UpdateRaidScheduleDto,
  ) {
    return this.raidScheduleService.update(+id, +userId, updateRaidScheduleDto);
  }

  @ApiOperation({ summary: '레이드 일정 삭제' })
  @ApiParam({ name: 'id', description: '레이드 일정 ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({ status: 204, description: '레이드 일정 삭제 성공' })
  @ApiResponse({ status: 404, description: '레이드 일정을 찾을 수 없음' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/users/:userId')
  async remove(@Param('id') id: string, @Param('userId') userId: string) {
    await this.raidScheduleService.remove(+id, +userId);
  }
}
