import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRaidGroupDto {
  @ApiProperty({ description: '공격대 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '공격대 설명' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '공개 여부', default: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}

export class UpdateRaidGroupDto {
  @ApiProperty({ description: '공격대 이름' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '공격대 설명' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '공개 여부' })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiProperty({ description: '리더 ID' })
  @IsNumber()
  @IsOptional()
  leaderId?: number;
}

export class RaidGroupResponseDto {
  @ApiProperty({ description: '공격대 ID' })
  id: number;

  @ApiProperty({ description: '공격대 이름' })
  name: string;

  @ApiProperty({ description: '공격대 설명' })
  description?: string;

  @ApiProperty({ description: '리더 ID' })
  leaderId?: number;

  @ApiProperty({ description: '공개 여부' })
  isPublic: boolean;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;
}

export class RaidGroupDetailResponseDto extends RaidGroupResponseDto {
  @ApiProperty({ description: '공격대 멤버 수' })
  memberCount: number;

  @ApiProperty({ description: '예정된 일정 수' })
  scheduleCount: number;
}
