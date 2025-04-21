import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCharacterDto, UpdateCharacterDto } from './dto/character.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LostarkService } from '../lostark/lostark.service';

@Injectable()
export class CharacterService {
  constructor(
    private prisma: PrismaService,
    private lostarkService: LostarkService,
  ) {}

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

  async findMainCharacter(userId: number) {
    const character = await this.prisma.character.findFirst({
      where: {
        userId,
        isRepresentative: true,
      },
    });

    if (!character) {
      throw new NotFoundException(
        `사용자 ID ${userId}의 대표 캐릭터를 찾을 수 없습니다`,
      );
    }

    return character;
  }

  async create(userId: number, createCharacterDto: CreateCharacterDto) {
    try {
      // 로스트아크 API에서 캐릭터 정보 확인
      const lostarkCharacter = await this.lostarkService.getCharacterBasicInfo(
        createCharacterDto.name,
      );

      // 대표 캐릭터로 설정하려는 경우 기존 대표 캐릭터 해제
      if (createCharacterDto.isRepresentative) {
        await this.resetRepresentativeCharacter(userId);
      }

      // 로스트아크 API에서 가져온 정보로 업데이트
      return this.prisma.character.create({
        data: {
          name: lostarkCharacter.name,
          job: lostarkCharacter.job,
          itemLevel: lostarkCharacter.itemLevel,
          server: lostarkCharacter.server,
          level: lostarkCharacter.level,
          isRepresentative: createCharacterDto.isRepresentative || false,
          userId,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `캐릭터를 생성할 수 없습니다: ${error.message}`,
      );
    }
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

    // 이름이 변경된 경우 로스트아크 API에서 정보 가져오기
    if (updateCharacterDto.name && updateCharacterDto.name !== character.name) {
      try {
        const lostarkCharacter =
          await this.lostarkService.getCharacterBasicInfo(
            updateCharacterDto.name,
          );

        return this.prisma.character.update({
          where: { id },
          data: {
            name: lostarkCharacter.name,
            job: lostarkCharacter.job,
            itemLevel: lostarkCharacter.itemLevel,
            server: lostarkCharacter.server,
            level: lostarkCharacter.level,
            isRepresentative:
              updateCharacterDto.isRepresentative ?? character.isRepresentative,
          },
        });
      } catch (error) {
        throw new BadRequestException(
          `캐릭터 정보를 업데이트할 수 없습니다: ${error.message}`,
        );
      }
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

  // 로스트아크 API를 사용하여 캐릭터 정보 동기화
  async syncCharacterWithLostArk(id: number) {
    const character = await this.prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      throw new NotFoundException(`캐릭터 ID ${id}를 찾을 수 없습니다`);
    }

    try {
      const lostarkCharacter = await this.lostarkService.getCharacterBasicInfo(
        character.name,
      );

      return this.prisma.character.update({
        where: { id },
        data: {
          job: lostarkCharacter.job,
          itemLevel: lostarkCharacter.itemLevel,
          server: lostarkCharacter.server,
          level: lostarkCharacter.level,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        `캐릭터 정보를 동기화할 수 없습니다: ${error.message}`,
      );
    }
  }

  // 특정 아이템 정보 가져오기
  async getCharacterItem(characterId: number, itemName: string) {
    const character = await this.prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      throw new NotFoundException(
        `캐릭터 ID ${characterId}를 찾을 수 없습니다`,
      );
    }

    try {
      const equipment = await this.lostarkService.getCharacterEquipment(
        character.name,
      );

      // 아이템 이름으로 필터링
      const item = equipment.find((item) =>
        item.Name.toLowerCase().includes(itemName.toLowerCase()),
      );

      if (!item) {
        throw new NotFoundException(
          `아이템 "${itemName}"을(를) 찾을 수 없습니다`,
        );
      }

      return {
        id: item.Id || `${character.name}-${itemName}`,
        name: item.Name,
        tier: item.Tier || 0,
        quality: item.Quality || 0,
        type: item.Type || 'Unknown',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `아이템 정보를 가져올 수 없습니다: ${error.message}`,
      );
    }
  }
}
