import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TimelineService {
    constructor(private prisma: PrismaService) { }

    async create(createMilestoneDto: any) {
        return this.prisma.milestone.create({
            data: createMilestoneDto,
        });
    }

    async findAll() {
        return this.prisma.milestone.findMany({
            orderBy: { order: 'asc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.milestone.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateMilestoneDto: any) {
        return this.prisma.milestone.update({
            where: { id },
            data: updateMilestoneDto,
        });
    }

    async remove(id: string) {
        return this.prisma.milestone.delete({
            where: { id },
        });
    }

    async reorder(updates: Array<{ id: string; order: number }>) {
        const promises = updates.map(({ id, order }) =>
            this.prisma.milestone.update({
                where: { id },
                data: { order },
            })
        );
        return Promise.all(promises);
    }
}
