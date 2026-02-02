import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RedirectsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.redirect.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findByPath(fromPath: string) {
        return this.prisma.redirect.findUnique({
            where: { fromPath },
        });
    }

    async create(data: any) {
        return this.prisma.redirect.create({
            data,
        });
    }

    async update(id: string, data: any) {
        return this.prisma.redirect.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return this.prisma.redirect.delete({
            where: { id },
        });
    }

    async incrementHits(id: string) {
        return this.prisma.redirect.update({
            where: { id },
            data: {
                hits: { increment: 1 },
            },
        });
    }

    async checkRedirect(path: string) {
        const redirect = await this.prisma.redirect.findFirst({
            where: {
                fromPath: path,
                isActive: true,
            },
        });

        if (redirect) {
            await this.incrementHits(redirect.id);
        }

        return redirect;
    }
}
