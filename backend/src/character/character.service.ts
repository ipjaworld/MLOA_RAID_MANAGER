import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCharacterDto, UpdateCharacterDto } from './dto/character.dto';

@Injectable()
export class CharacterService {
  private prisma = new PrismaClient();

  async findAll(userId?: number) {
    if (userId) {
      return this.prisma.character.findMany({
        where: { userId },
        orderBy: { isRepresentative: 'desc' },
      });
    }
    return this.prisma.character.findMany({
      orderBy: { isRepresentative: 'desc' },
    });
  }

  async findOne(id: number) {
    const character = await this.prisma.character.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    if (!character) {
      throw new NotFoundException(`캐릭터 ID ${id}를 찾을 수 없습니다`);
    }

    return character;
  }

  async create(userId: number, createCharacterDto: CreateCharacterDto) {
    // 대표 캐릭터로 설정하려는 경우 기존 대표 캐릭터 해제
    if (createCharacterDto.isRepresentative) {
      await this.resetRepresentativeCharacter(userId);
    }

    return this.prisma.character.create({
      data: {
        ...createCharacterDto,
        userId,
      },
    });
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    // 캐릭터 존재 여부 확인
    const character = await this.prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException(`캐릭터 ID ${id}를 찾을 수 없습니다`);
    }

    // 대표 캐릭터로 설정하려는 경우 기존 대표 캐릭터 해제
    if (updateCharacterDto.isRepresentative) {
      await this.resetRepresentativeCharacter(character.userId);
    }

    return this.prisma.character.update({
      where: { id },
      data: updateCharacterDto,
    });
  }

  async remove(id: number) {
    // 캐릭터 존재 여부 확인
    const character = await this.prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException(`캐릭터 ID ${id}를 찾을 수 없습니다`);
    }

    return this.prisma.character.delete({
      where: { id },
    });
  }

  private async resetRepresentativeCharacter(userId: number) {
    await this.prisma.character.updateMany({
      where: {
        userId,
        isRepresentative: true,
      },
      data: {
        isRepresentative: false,
      },
    });
  }
}
