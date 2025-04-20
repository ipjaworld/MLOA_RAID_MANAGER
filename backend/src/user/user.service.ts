import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CharacterService } from '../character/character.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private characterService: CharacterService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nickname: true,
        loginType: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        loginType: true,
        createdAt: true,
        characters: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`사용자 ID ${id}를 찾을 수 없습니다`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;

    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    // 응답에서 비밀번호 제외
    const { password: _, ...result } = newUser;
    return result;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, ...userData } = updateUserDto;

    // 사용자 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`사용자 ID ${id}를 찾을 수 없습니다`);
    }

    // 비밀번호가 제공된 경우 해시 처리
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });

    // 응답에서 비밀번호 제외
    const { password: _, ...result } = updatedUser;
    return result;
  }

  async remove(id: number) {
    // 사용자 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`사용자 ID ${id}를 찾을 수 없습니다`);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { success: true };
  }

  async getUserRaidGroups(userId: number) {
    // 사용자 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다`);
    }

    // 사용자가 속한 공격대 조회
    const memberships = await this.prisma.raidMembership.findMany({
      where: { userId },
      include: {
        raidGroup: true,
      },
    });

    return memberships.map((membership) => ({
      id: membership.raidGroup.id,
      name: membership.raidGroup.name,
      description: membership.raidGroup.description,
      visibility: membership.raidGroup.isPublic ? 'public' : 'private',
      leader: {
        id: membership.raidGroup.leaderId,
      },
      role: membership.role,
      created_at: membership.raidGroup.createdAt,
    }));
  }

  // 사용자의 모든 일정 가져오기
  async getUserSchedules(userId: number, year?: number, month?: number) {
    // 사용자 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`사용자 ID ${userId}를 찾을 수 없습니다`);
    }

    let dateFilter = {};

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // 한 달 기준으로 전후 1주일 추가
      startDate.setDate(startDate.getDate() - 7);
      endDate.setDate(endDate.getDate() + 7);

      dateFilter = {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    return this.prisma.schedule.findMany({
      where: {
        userId,
        ...dateFilter,
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }
}
