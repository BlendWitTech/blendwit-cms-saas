import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeadsService {
    constructor(private prisma: PrismaService) { }

    async create(createLeadDto: any) {
        return this.prisma.lead.create({
            data: createLeadDto,
        });
    }

    async findAll(status?: string) {
        const where: any = {};
        if (status) where.status = status;

        return this.prisma.lead.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.lead.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateLeadDto: any) {
        return this.prisma.lead.update({
            where: { id },
            data: updateLeadDto,
        });
    }

    async remove(id: string) {
        return this.prisma.lead.delete({
            where: { id },
        });
    }

    async updateStatus(id: string, status: string) {
        return this.prisma.lead.update({
            where: { id },
            data: { status },
        });
    }

    async getStats() {
        const [total, newLeads, contacted, converted] = await Promise.all([
            this.prisma.lead.count(),
            this.prisma.lead.count({ where: { status: 'NEW' } }),
            this.prisma.lead.count({ where: { status: 'CONTACTED' } }),
            this.prisma.lead.count({ where: { status: 'CONVERTED' } }),
        ]);

        return { total, newLeads, contacted, converted };
    }
}
