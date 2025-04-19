import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateScheduleDto, UpdateScheduleDto } from './dto/schedule.dto';

@Injectable()
export class ScheduleService {
  private prisma = new PrismaClient();

  async findAll(userId?: number) {
    const where = userId ? { userId } : {};

    return this.prisma.schedule.findMany({
      where,
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const schedule = await this.prisma.schedule.findUnique({
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

    if (!schedule) {
      throw new NotFoundException(`일정 ID ${id}를 찾을 수 없습니다`);
    }

    return schedule;
  }

  async create(userId: number, createScheduleDto: CreateScheduleDto) {
    return this.prisma.schedule.create({
      data: {
        ...createScheduleDto,
        userId,
        startTime: new Date(createScheduleDto.startTime),
        endTime: new Date(createScheduleDto.endTime),
      },
    });
  }

  async update(
    id: number,
    userId: number,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    // 일정 존재 여부 확인
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException(`일정 ID ${id}를 찾을 수 없습니다`);
    }

    // 일정 소유자 확인
    if (schedule.userId !== userId) {
      throw new ForbiddenException('자신의 일정만 수정할 수 있습니다');
    }

    const data: any = { ...updateScheduleDto };
    if (updateScheduleDto.startTime) {
      data.startTime = new Date(updateScheduleDto.startTime);
    }
    if (updateScheduleDto.endTime) {
      data.endTime = new Date(updateScheduleDto.endTime);
    }

    return this.prisma.schedule.update({
      where: { id },
      data,
    });
  }

  async remove(id: number, userId: number) {
    // 일정 존재 여부 확인
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new NotFoundException(`일정 ID ${id}를 찾을 수 없습니다`);
    }

    // 일정 소유자 확인
    if (schedule.userId !== userId) {
      throw new ForbiddenException('자신의 일정만 삭제할 수 있습니다');
    }

    return this.prisma.schedule.delete({
      where: { id },
    });
  }

  async getUpcomingSchedules(userId: number, days: number = 7) {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + days);

    return this.prisma.schedule.findMany({
      where: {
        userId,
        startTime: {
          gte: today,
          lt: endDate,
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }
}
