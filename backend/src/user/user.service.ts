import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
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

    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
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

    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        ...(hashedPassword && { password: hashedPassword }),
      },
    });
  }

  async remove(id: number) {
    // 사용자 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`사용자 ID ${id}를 찾을 수 없습니다`);
    }

    return this.prisma.user.delete({
      where: { id },
    });
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
      ...membership.raidGroup,
      role: membership.role,
    }));
  }
}
