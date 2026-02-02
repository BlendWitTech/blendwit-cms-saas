import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
    constructor(private prisma: PrismaService) { }

    create(data: any) {
        const { name, slug } = data;
        const insertData: any = { name };

        insertData.slug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        return this.prisma.tag.create({ data: insertData });
    }

    findAll() {
        return this.prisma.tag.findMany({
            include: { _count: { select: { posts: true } } }
        });
    }

    remove(id: string) {
        return this.prisma.tag.delete({ where: { id } });
    }
}
