import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  CreateRaidScheduleDto,
  UpdateRaidScheduleDto,
} from './dto/raid-schedule.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RaidScheduleService {
  constructor(private prisma: PrismaService) {}

  async findAll(raidGroupId?: number) {
    const where = raidGroupId ? { raidGroupId } : {};

    return this.prisma.raidSchedule.findMany({
      where,
      include: {
        raidGroup: {
          select: {
            id: true,
            name: true,
            leaderId: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const schedule = await this.prisma.raidSchedule.findUnique({
      where: { id },
      include: {
        raidGroup: {
          select: {
            id: true,
            name: true,
            leaderId: true,
            memberships: {
              select: {
                userId: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundException(`레이드 일정 ID ${id}를 찾을 수 없습니다`);
    }

    return schedule;
  }

  async create(
    raidGroupId: number,
    userId: number,
    createRaidScheduleDto: CreateRaidScheduleDto,
  ) {
    // 공격대 존재 여부 확인
    const raidGroup = await this.prisma.raidGroup.findUnique({
      where: { id: raidGroupId },
      include: {
        memberships: {
          where: {
            userId,
          },
        },
      },
    });

    if (!raidGroup) {
      throw new NotFoundException(
        `공격대 ID ${raidGroupId}를 찾을 수 없습니다`,
      );
    }

    // 공격대 멤버 여부 확인 (리더 또는 멤버)
    if (raidGroup.memberships.length === 0) {
      throw new ForbiddenException('공격대 멤버만 일정을 생성할 수 있습니다');
    }

    return this.prisma.raidSchedule.create({
      data: {
        ...createRaidScheduleDto,
        raidGroupId,
        startTime: new Date(createRaidScheduleDto.startTime),
        endTime: new Date(createRaidScheduleDto.endTime),
      },
    });
  }

  async update(
    id: number,
    userId: number,
    updateRaidScheduleDto: UpdateRaidScheduleDto,
  ) {
    // 레이드 일정 존재 여부 확인
    const schedule = await this.prisma.raidSchedule.findUnique({
      where: { id },
      include: {
        raidGroup: {
          include: {
            memberships: {
              where: {
                userId,
              },
            },
          },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundException(`레이드 일정 ID ${id}를 찾을 수 없습니다`);
    }

    // 공격대 리더나 일정 생성자만 수정 가능
    const isLeader = schedule.raidGroup.leaderId === userId;
    const isMember = schedule.raidGroup.memberships.length > 0;

    if (!isLeader && !isMember) {
      throw new ForbiddenException(
        '공격대 리더 또는 멤버만 일정을 수정할 수 있습니다',
      );
    }

    const data: any = { ...updateRaidScheduleDto };
    if (updateRaidScheduleDto.startTime) {
      data.startTime = new Date(updateRaidScheduleDto.startTime);
    }
    if (updateRaidScheduleDto.endTime) {
      data.endTime = new Date(updateRaidScheduleDto.endTime);
    }

    return this.prisma.raidSchedule.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number) {
    // 레이드 일정 존재 여부 확인
    const schedule = await this.prisma.raidSchedule.findUnique({
      where: { id },
      include: {
        raidGroup: true,
      },
    });

    if (!schedule) {
      throw new NotFoundException(`레이드 일정 ID ${id}를 찾을 수 없습니다`);
    }

    // 공격대 리더만 삭제 가능
    if (schedule.raidGroup.leaderId !== userId) {
      throw new ForbiddenException('공격대 리더만 일정을 삭제할 수 있습니다');
    }

    return this.prisma.raidSchedule.delete({
      where: { id },
    });
  }

  async getUpcomingSchedules(userId: number, days: number = 7) {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);

    // 사용자가 속한 모든 공격대의 일정을 조회
    const userMemberships = await this.prisma.raidMembership.findMany({
      where: {
        userId,
      },
      select: {
        raidGroupId: true,
      },
    });

    const raidGroupIds = userMemberships.map(
      (membership) => membership.raidGroupId,
    );

    return this.prisma.raidSchedule.findMany({
      where: {
        raidGroupId: {
          in: raidGroupIds,
        },
        startTime: {
          gte: today,
          lt: endDate,
        },
      },
      include: {
        raidGroup: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }
}
