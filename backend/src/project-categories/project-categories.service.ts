import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectCategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(data: { name: string; description?: string; slug?: string }) {
        const slug = data.slug || data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        return this.prisma.projectCategory.create({
            data: {
                ...data,
                slug,
            },
            include: {
                _count: {
                    select: { projects: true }
                }
            }
        });
    }

    async findAll() {
        return this.prisma.projectCategory.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { projects: true }
                }
            }
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.projectCategory.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { projects: true }
                }
            }
        });

        if (!category) {
            throw new NotFoundException(`Project Category with ID ${id} not found`);
        }

        return category;
    }

    async update(id: string, data: { name?: string; description?: string; slug?: string }) {
        const category = await this.prisma.projectCategory.findUnique({ where: { id } });
        if (!category) throw new NotFoundException(`Project Category with ID ${id} not found`);

        if (data.name && !data.slug && !category.slug) {
            data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }

        return this.prisma.projectCategory.update({
            where: { id },
            data,
            include: {
                _count: {
                    select: { projects: true }
                }
            }
        });
    }

    async remove(id: string) {
        return this.prisma.projectCategory.delete({
            where: { id },
        });
    }
}
