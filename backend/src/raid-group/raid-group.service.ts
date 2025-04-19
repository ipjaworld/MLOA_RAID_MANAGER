import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateRaidGroupDto, UpdateRaidGroupDto } from './dto/raid-group.dto';

@Injectable()
export class RaidGroupService {
  private prisma = new PrismaClient();

  async findAll(isPublic?: boolean) {
    const where = isPublic !== undefined ? { isPublic } : {};

    const raidGroups = await this.prisma.raidGroup.findMany({
      where,
      include: {
        leader: {
          select: {
            id: true,
            nickname: true,
          },
        },
        _count: {
          select: {
            memberships: true,
            schedules: true,
          },
        },
      },
    });

    return raidGroups.map((group) => ({
      ...group,
      memberCount: group._count.memberships,
      scheduleCount: group._count.schedules,
      _count: undefined,
    }));
  }

  async findOne(id: number) {
    const raidGroup = await this.prisma.raidGroup.findUnique({
      where: { id },
      include: {
        leader: {
          select: {
            id: true,
            nickname: true,
          },
        },
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                nickname: true,
              },
            },
          },
        },
        schedules: true,
        _count: {
          select: {
            memberships: true,
            schedules: true,
          },
        },
      },
    });

    if (!raidGroup) {
      throw new NotFoundException(`공격대 ID ${id}를 찾을 수 없습니다`);
    }

    return {
      ...raidGroup,
      memberCount: raidGroup._count.memberships,
      scheduleCount: raidGroup._count.schedules,
      _count: undefined,
    };
  }

  async create(userId: number, createRaidGroupDto: CreateRaidGroupDto) {
    // 리더로 유저 설정
    return this.prisma.raidGroup.create({
      data: {
        ...createRaidGroupDto,
        leaderId: userId,
        // 리더를 첫 멤버로 추가
        memberships: {
          create: {
            userId,
            role: 'leader',
          },
        },
      },
    });
  }

  async update(
    id: number,
    userId: number,
    updateRaidGroupDto: UpdateRaidGroupDto,
  ) {
    // 공격대 존재 여부 확인
    const raidGroup = await this.prisma.raidGroup.findUnique({
      where: { id },
    });

    if (!raidGroup) {
      throw new NotFoundException(`공격대 ID ${id}를 찾을 수 없습니다`);
    }

    // 리더만 수정 가능
    if (raidGroup.leaderId !== userId) {
      throw new ForbiddenException('공격대 리더만 정보를 수정할 수 있습니다');
    }

    return this.prisma.raidGroup.update({
      where: { id },
      data: updateRaidGroupDto,
    });
  }

  async remove(id: number, userId: number) {
    // 공격대 존재 여부 확인
    const raidGroup = await this.prisma.raidGroup.findUnique({
      where: { id },
    });

    if (!raidGroup) {
      throw new NotFoundException(`공격대 ID ${id}를 찾을 수 없습니다`);
    }

    // 리더만 삭제 가능
    if (raidGroup.leaderId !== userId) {
      throw new ForbiddenException('공격대 리더만 삭제할 수 있습니다');
    }

    return this.prisma.raidGroup.delete({
      where: { id },
    });
  }

  async joinRaidGroup(raidGroupId: number, userId: number) {
    // 공격대 존재 여부 확인
    const raidGroup = await this.prisma.raidGroup.findUnique({
      where: { id: raidGroupId },
    });

    if (!raidGroup) {
      throw new NotFoundException(
        `공격대 ID ${raidGroupId}를 찾을 수 없습니다`,
      );
    }

    // 비공개 공격대인 경우 가입 불가
    if (!raidGroup.isPublic) {
      throw new ForbiddenException(
        '비공개 공격대에는 초대를 통해서만 가입할 수 있습니다',
      );
    }

    // 이미 가입 여부 확인
    const existingMembership = await this.prisma.raidMembership.findUnique({
      where: {
        userId_raidGroupId: {
          userId,
          raidGroupId,
        },
      },
    });

    if (existingMembership) {
      throw new ForbiddenException('이미 가입된 공격대입니다');
    }

    return this.prisma.raidMembership.create({
      data: {
        userId,
        raidGroupId,
        role: 'member',
      },
    });
  }

  async leaveRaidGroup(raidGroupId: number, userId: number) {
    // 멤버십 존재 여부 확인
    const membership = await this.prisma.raidMembership.findUnique({
      where: {
        userId_raidGroupId: {
          userId,
          raidGroupId,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('가입되지 않은 공격대입니다');
    }

    // 리더인 경우 탈퇴 불가
    if (membership.role === 'leader') {
      throw new ForbiddenException(
        '공격대 리더는 탈퇴할 수 없습니다. 리더를 변경하거나 공격대를 삭제해주세요.',
      );
    }

    return this.prisma.raidMembership.delete({
      where: {
        userId_raidGroupId: {
          userId,
          raidGroupId,
        },
      },
    });
  }

  async changeLeader(
    raidGroupId: number,
    currentLeaderId: number,
    newLeaderId: number,
  ) {
    // 공격대 존재 여부 확인
    const raidGroup = await this.prisma.raidGroup.findUnique({
      where: { id: raidGroupId },
      include: {
        memberships: true,
      },
    });

    if (!raidGroup) {
      throw new NotFoundException(
        `공격대 ID ${raidGroupId}를 찾을 수 없습니다`,
      );
    }

    // 현재 리더 확인
    if (raidGroup.leaderId !== currentLeaderId) {
      throw new ForbiddenException('공격대 리더만 리더를 변경할 수 있습니다');
    }

    // 새 리더가 멤버인지 확인
    const newLeaderMembership = raidGroup.memberships.find(
      (m) => m.userId === newLeaderId,
    );
    if (!newLeaderMembership) {
      throw new NotFoundException('지정한 사용자는 공격대 멤버가 아닙니다');
    }

    // 트랜잭션으로 리더 변경
    return this.prisma.$transaction(async (tx) => {
      // 현재 리더 역할 변경
      await tx.raidMembership.update({
        where: {
          userId_raidGroupId: {
            userId: currentLeaderId,
            raidGroupId,
          },
        },
        data: {
          role: 'member',
        },
      });

      // 새 리더 역할 변경
      await tx.raidMembership.update({
        where: {
          userId_raidGroupId: {
            userId: newLeaderId,
            raidGroupId,
          },
        },
        data: {
          role: 'leader',
        },
      });

      // 공격대 리더 변경
      return tx.raidGroup.update({
        where: { id: raidGroupId },
        data: {
          leaderId: newLeaderId,
        },
      });
    });
  }
}
