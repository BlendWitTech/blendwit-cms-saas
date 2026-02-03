import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SeoMetaService } from '../seo-meta/seo-meta.service';

@Injectable()
export class PagesService {
    constructor(
        private prisma: PrismaService,
        private seoMetaService: SeoMetaService
    ) { }

    async create(data: any) {
        const slug = data.slug || data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        return this.prisma.page.create({
            data: {
                ...data,
                slug,
            },
        });
    }

    async findAll() {
        return this.prisma.page.findMany({
            orderBy: { updatedAt: 'desc' },
        });
    }

    async findById(idOrSlug: string) {
        // Try to find by ID (UUID format)
        let page: any = null;
        const isUuid = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(idOrSlug);

        if (isUuid) {
            page = await (this.prisma as any).page.findUnique({
                where: { id: idOrSlug },
            });
        }

        // If not found by ID, try format as slug
        if (!page) {
            page = await (this.prisma as any).page.findUnique({
                where: { slug: idOrSlug },
            });
        }

        if (page) {
            const seo = await this.seoMetaService.findByPage('page', page.id);
            return { ...page, seo };
        }

        throw new NotFoundException(`Page with identifier '${idOrSlug}' not found`);
    }

    async update(idOrSlug: string, updatePageDto: any) {
        // Resolve ID first
        let id = idOrSlug;
        const isUuid = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(idOrSlug);

        if (!isUuid) {
            const existing = await (this.prisma as any).page.findUnique({ where: { slug: idOrSlug } });
            if (existing) id = existing.id;
        }

        const { seo, ...pageData } = updatePageDto;
        const data: any = { ...pageData };

        const page = await (this.prisma as any).page.update({
            where: { id },
            data,
        });

        if (seo) {
            await this.seoMetaService.upsert({
                pageType: 'page',
                pageId: page.id,
                title: seo.title,
                description: seo.description
            });
        }

        return page;
    }

    async remove(id: string) {
        return this.prisma.page.delete({
            where: { id },
        });
    }
}
