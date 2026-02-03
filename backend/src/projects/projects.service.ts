import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    async create(createProjectDto: any) {
        const { seoMeta, ...projectData } = createProjectDto;
        return this.prisma.project.create({
            data: {
                ...projectData,
                seoMeta: seoMeta ? {
                    create: seoMeta
                } : undefined
            },
            include: { category: true, seoMeta: true }
        });
    }

    async findAll(status?: string, category?: string, featured?: boolean) {
        const where: any = {};
        if (status) where.status = status;
        if (category) where.category = { slug: category };
        if (featured !== undefined) where.featured = featured;

        return this.prisma.project.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { category: true }
        });
    }

    async findOne(slug: string) {
        return this.prisma.project.findUnique({
            where: { slug },
            include: { category: true }
        });
    }

    async findById(id: string) {
        return this.prisma.project.findUnique({
            where: { id },
            include: { category: true }
        });
    }

    async update(id: string, updateProjectDto: any) {
        const { seoMeta, ...projectData } = updateProjectDto;

        if (seoMeta) {
            await (this.prisma as any).seoMeta.upsert({
                where: { projectId: id },
                create: { ...seoMeta, projectId: id },
                update: seoMeta
            });
        }

        return this.prisma.project.update({
            where: { id },
            data: projectData,
            include: { category: true, seoMeta: true }
        });
    }

    async remove(id: string) {
        return this.prisma.project.delete({
            where: { id },
        });
    }

    // Public methods
    async findPublished(page: number = 1, limit: number = 10, category?: string) {
        const skip = (page - 1) * limit;
        const where: any = { status: 'COMPLETED' };
        if (category) where.category = { slug: category };

        const [projects, total] = await Promise.all([
            this.prisma.project.findMany({
                where,
                orderBy: { completionDate: 'desc' },
                skip,
                take: limit,
                include: { category: true }
            }),
            this.prisma.project.count({ where }),
        ]);

        return {
            projects,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findFeatured() {
        return this.prisma.project.findMany({
            where: { featured: true, status: 'COMPLETED' },
            orderBy: { completionDate: 'desc' },
            take: 6,
            include: { category: true }
        });
    }
}
