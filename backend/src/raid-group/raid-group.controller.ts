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
import { RaidGroupService } from './raid-group.service';
import {
  CreateRaidGroupDto,
  UpdateRaidGroupDto,
  RaidGroupResponseDto,
  RaidGroupDetailResponseDto,
} from './dto/raid-group.dto';

@ApiTags('raid-groups')
@Controller('raid-groups')
export class RaidGroupController {
  constructor(private readonly raidGroupService: RaidGroupService) {}

  @ApiOperation({ summary: '모든 공격대 조회' })
  @ApiQuery({
    name: 'isPublic',
    required: false,
    description: '공개 여부로 필터링',
  })
  @ApiResponse({
    status: 200,
    description: '공격대 목록 조회 성공',
    type: [RaidGroupResponseDto],
  })
  @Get()
  async findAll(@Query('isPublic') isPublic?: string) {
    return this.raidGroupService.findAll(
      isPublic !== undefined ? isPublic === 'true' : undefined,
    );
  }

  @ApiOperation({ summary: '공격대 상세 조회' })
  @ApiParam({ name: 'id', description: '공격대 ID' })
  @ApiResponse({
    status: 200,
    description: '공격대 조회 성공',
    type: RaidGroupDetailResponseDto,
  })
  @ApiResponse({ status: 404, description: '공격대를 찾을 수 없음' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.raidGroupService.findOne(+id);
  }

  @ApiOperation({ summary: '공격대 생성' })
  @ApiParam({ name: 'userId', description: '사용자 ID (리더)' })
  @ApiResponse({
    status: 201,
    description: '공격대 생성 성공',
    type: RaidGroupResponseDto,
  })
  @Post('users/:userId')
  async create(
    @Param('userId') userId: string,
    @Body() createRaidGroupDto: CreateRaidGroupDto,
  ) {
    return this.raidGroupService.create(+userId, createRaidGroupDto);
  }

  @ApiOperation({ summary: '공격대 정보 수정' })
  @ApiParam({ name: 'id', description: '공격대 ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID (리더)' })
  @ApiResponse({
    status: 200,
    description: '공격대 정보 수정 성공',
    type: RaidGroupResponseDto,
  })
  @ApiResponse({ status: 404, description: '공격대를 찾을 수 없음' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @Put(':id/users/:userId')
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateRaidGroupDto: UpdateRaidGroupDto,
  ) {
    return this.raidGroupService.update(+id, +userId, updateRaidGroupDto);
  }

  @ApiOperation({ summary: '공격대 삭제' })
  @ApiParam({ name: 'id', description: '공격대 ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID (리더)' })
  @ApiResponse({ status: 204, description: '공격대 삭제 성공' })
  @ApiResponse({ status: 404, description: '공격대를 찾을 수 없음' })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/users/:userId')
  async remove(@Param('id') id: string, @Param('userId') userId: string) {
    await this.raidGroupService.remove(+id, +userId);
  }

  @ApiOperation({ summary: '공격대 가입' })
  @ApiParam({ name: 'id', description: '공격대 ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({ status: 201, description: '공격대 가입 성공' })
  @ApiResponse({ status: 404, description: '공격대를 찾을 수 없음' })
  @ApiResponse({ status: 403, description: '비공개 공격대 또는 이미 가입됨' })
  @Post(':id/join/users/:userId')
  async joinRaidGroup(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.raidGroupService.joinRaidGroup(+id, +userId);
  }

  @ApiOperation({ summary: '공격대 탈퇴' })
  @ApiParam({ name: 'id', description: '공격대 ID' })
  @ApiParam({ name: 'userId', description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '공격대 탈퇴 성공' })
  @ApiResponse({ status: 404, description: '가입되지 않은 공격대' })
  @ApiResponse({ status: 403, description: '리더는 탈퇴할 수 없음' })
  @Post(':id/leave/users/:userId')
  async leaveRaidGroup(
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.raidGroupService.leaveRaidGroup(+id, +userId);
  }

  @ApiOperation({ summary: '공격대 리더 변경' })
  @ApiParam({ name: 'id', description: '공격대 ID' })
  @ApiParam({ name: 'currentLeaderId', description: '현재 리더 ID' })
  @ApiParam({ name: 'newLeaderId', description: '새 리더 ID' })
  @ApiResponse({ status: 200, description: '리더 변경 성공' })
  @ApiResponse({
    status: 404,
    description: '공격대 또는, 새 리더를 찾을 수 없음',
  })
  @ApiResponse({ status: 403, description: '권한 없음' })
  @Post(':id/change-leader/users/:currentLeaderId/to/:newLeaderId')
  async changeLeader(
    @Param('id') id: string,
    @Param('currentLeaderId') currentLeaderId: string,
    @Param('newLeaderId') newLeaderId: string,
  ) {
    return this.raidGroupService.changeLeader(
      +id,
      +currentLeaderId,
      +newLeaderId,
    );
  }
}
