import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    create(data: any) {
        const { name, slug, description } = data;
        const insertData: any = { name, description };

        // Auto-generate slug if not provided
        insertData.slug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        return this.prisma.category.create({ data: insertData });
    }

    findAll() {
        return this.prisma.category.findMany({
            include: { _count: { select: { posts: true } } }
        });
    }

    findOne(id: string) {
        return this.prisma.category.findUnique({ where: { id } });
    }

    update(id: string, data: any) {
        const { name, slug, description } = data;
        return this.prisma.category.update({
            where: { id },
            data: { name, slug, description }
        });
    }

    remove(id: string) {
        return this.prisma.category.delete({ where: { id } });
    }
}
