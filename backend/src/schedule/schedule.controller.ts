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
import { ScheduleService } from './schedule.service';
import {
  CreateScheduleDto,
  UpdateScheduleDto,
  ScheduleResponseDto,
} from './dto/schedule.dto';

@ApiTags('schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @ApiOperation({ summary: '모든 개인 일정 조회' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: '사용자 ID로 필터링',
  })
  @ApiResponse({
    status: 200,
    description: '개인 일정 목록 조회 성공',
    type: [ScheduleResponseDto],
  })
  @Get()
  async findAll(@Query('userId') userId?: string) {
    return this.scheduleService.findAll(userId ? +userId : undefined);
  }

  @ApiOperation({ summary: '개인 일정 상세 조회' })
  @ApiParam({ name: 'id', description: '일정 ID' })
  @ApiResponse({
    status: 200,
    description: '개인 일정 조회 성공',
    type: ScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: '일정을 찾을 수 없음' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @ApiOperation({ summary: '특정 사용자의 예정된 일정 목록 조회' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiQuery({
    name: 'days',
    required: false,
    description: '앞으로 몇 일간의 일정을 조회할지 (기본값: 7)',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 일정 목록 조회 성공',
    type: [ScheduleResponseDto],
  })
  @Get('users/:userId/upcoming')
  async getUpcomingSchedules(
    @Param('userId') userId: string,
    @Query('days') days?: string,
  ) {
    return this.scheduleService.getUpcomingSchedules(
      +userId,
      days ? +days : undefined,
    );
  }

  @ApiOperation({ summary: '개인 일정 생성' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 201,
    description: '개인 일정 생성 성공',
    type: ScheduleResponseDto,
  })
  @Post('users/:userId')
  async create(
    @Param('userId') userId: string,
    @Body() createScheduleDto: CreateScheduleDto,
  ) {
    return this.scheduleService.create(+userId, createScheduleDto);
  }

  @ApiOperation({ summary: '개인 일정 수정' })
  @ApiParam({ name: 'id', description: '일정 ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({
    status: 200,
    description: '개인 일정 수정 성공',
    type: ScheduleResponseDto,
  })
  @ApiResponse({ status: 404, description: '일정을 찾을 수 없음' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @Put(':id/users/:userId')
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    return this.scheduleService.update(+id, +userId, updateScheduleDto);
  }

  @ApiOperation({ summary: '개인 일정 삭제' })
  @ApiParam({ name: 'id', description: '일정 ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({ status: 204, description: '개인 일정 삭제 성공' })
  @ApiResponse({ status: 404, description: '일정을 찾을 수 없음' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/users/:userId')
  async remove(@Param('id') id: string, @Param('userId') userId: string) {
    await this.scheduleService.remove(+id, +userId);
  }
}
