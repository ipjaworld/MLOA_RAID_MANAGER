import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRaidScheduleDto {
  @ApiProperty({ description: '일정 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: '일정 메모' })
  @IsString()
  @IsOptional()
  memo?: string;

  @ApiProperty({ description: '시작 시간', example: '2025-04-20T14:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({ description: '종료 시간', example: '2025-04-20T17:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  endTime: string;
}

export class UpdateRaidScheduleDto {
  @ApiProperty({ description: '일정 제목' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '일정 메모' })
  @IsString()
  @IsOptional()
  memo?: string;

  @ApiProperty({ description: '시작 시간', example: '2025-04-20T14:00:00Z' })
  @IsDateString()
  @IsOptional()
  startTime?: string;

  @ApiProperty({ description: '종료 시간', example: '2025-04-20T17:00:00Z' })
  @IsDateString()
  @IsOptional()
  endTime?: string;
}

export class RaidScheduleResponseDto {
  @ApiProperty({ description: '일정 ID' })
  id: number;

  @ApiProperty({ description: '공격대 ID' })
  raidGroupId: number;

  @ApiProperty({ description: '일정 제목' })
  title: string;

  @ApiProperty({ description: '일정 메모' })
  memo?: string;

  @ApiProperty({ description: '시작 시간' })
  startTime: Date;

  @ApiProperty({ description: '종료 시간' })
  endTime: Date;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;
}

export class RaidScheduleDetailResponseDto extends RaidScheduleResponseDto {
  @ApiProperty({ description: '공격대 정보' })
  raidGroup: {
    id: number;
    name: string;
  };
}
