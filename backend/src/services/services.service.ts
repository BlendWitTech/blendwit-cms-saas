import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServicesService {
    constructor(private prisma: PrismaService) { }

    async create(createServiceDto: any) {
        return this.prisma.service.create({
            data: createServiceDto,
        });
    }

    async findAll() {
        return this.prisma.service.findMany({
            orderBy: { order: 'asc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.service.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateServiceDto: any) {
        return this.prisma.service.update({
            where: { id },
            data: updateServiceDto,
        });
    }

    async remove(id: string) {
        return this.prisma.service.delete({
            where: { id },
        });
    }

    async reorder(updates: Array<{ id: string; order: number }>) {
        const promises = updates.map(({ id, order }) =>
            this.prisma.service.update({
                where: { id },
                data: { order },
            })
        );
        return Promise.all(promises);
    }
}
