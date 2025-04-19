import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '사용자 이메일' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '사용자 닉네임' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({ description: '사용자 비밀번호' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: '로그인 타입', default: 'default' })
  @IsString()
  @IsOptional()
  loginType?: string;
}

export class UpdateUserDto {
  @ApiProperty({ description: '사용자 닉네임' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ description: '사용자 비밀번호' })
  @IsString()
  @IsOptional()
  password?: string;
}

export class UserResponseDto {
  @ApiProperty({ description: '사용자 ID' })
  id: number;

  @ApiProperty({ description: '사용자 이메일' })
  email: string;

  @ApiProperty({ description: '사용자 닉네임' })
  nickname: string;

  @ApiProperty({ description: '로그인 타입' })
  loginType: string;

  @ApiProperty({ description: '생성 일시' })
  createdAt: Date;
}
