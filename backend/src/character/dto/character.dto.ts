import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCharacterDto {
  @ApiProperty({ description: '캐릭터 이름' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '캐릭터 직업' })
  @IsString()
  @IsOptional()
  job?: string;

  @ApiProperty({ description: '아이템 레벨' })
  @IsNumber()
  @IsOptional()
  itemLevel?: number;

  @ApiProperty({ description: '대표 캐릭터 여부', default: false })
  @IsBoolean()
  @IsOptional()
  isRepresentative?: boolean;
}

export class UpdateCharacterDto {
  @ApiProperty({ description: '캐릭터 이름' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '캐릭터 직업' })
  @IsString()
  @IsOptional()
  job?: string;

  @ApiProperty({ description: '아이템 레벨' })
  @IsNumber()
  @IsOptional()
  itemLevel?: number;

  @ApiProperty({ description: '대표 캐릭터 여부' })
  @IsBoolean()
  @IsOptional()
  isRepresentative?: boolean;
}

export class CharacterResponseDto {
  @ApiProperty({ description: '캐릭터 ID' })
  id: number;

  @ApiProperty({ description: '유저 ID' })
  userId: number;

  @ApiProperty({ description: '캐릭터 이름' })
  name: string;

  @ApiProperty({ description: '캐릭터 직업' })
  job?: string;

  @ApiProperty({ description: '아이템 레벨' })
  itemLevel?: number;

  @ApiProperty({ description: '대표 캐릭터 여부' })
  isRepresentative: boolean;
}
