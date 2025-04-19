import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateScheduleDto {
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

export class UpdateScheduleDto {
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

export class ScheduleResponseDto {
  @ApiProperty({ description: '일정 ID' })
  id: number;

  @ApiProperty({ description: '사용자 ID' })
  userId: number;

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
