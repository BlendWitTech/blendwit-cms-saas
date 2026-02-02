import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';

import { SeoMetaService } from '../seo-meta/seo-meta.service';

@Injectable()
export class BlogsService {
    constructor(
        private prisma: PrismaService,
        private seoMetaService: SeoMetaService
    ) { }

    async create(authorId: string, createPostDto: any) {
        const { categories, tags, seo, ...postData } = createPostDto;

        const { title, slug, content, excerpt, coverImage, status, featured, publishedAt } = postData;
        const data: any = {
            title,
            slug,
            content,
            excerpt,
            coverImage,
            status: status || 'DRAFT',
            featured: featured || false,
            authorId,
            publishedAt: status === 'PUBLISHED' ? new Date() : (publishedAt || null)
        };

        if (categories && categories.length > 0) {
            data.categories = {
                connect: categories.map((id: string) => ({ id }))
            };
        }

        if (tags && tags.length > 0) {
            data.tags = {
                connectOrCreate: tags.map((tag: string) => ({
                    where: { name: tag },
                    create: { name: tag, slug: tag.toLowerCase().replace(/ /g, '-') }
                }))
            };
        }

        const post = await (this.prisma as any).post.create({ data });

        if (seo) {
            await this.seoMetaService.upsert({
                pageType: 'post',
                pageId: post.id,
                title: seo.title,
                description: seo.description
            });
        }

        return post;
    }

    async findAll(status?: string, category?: string, tag?: string) {
        const where: any = {};
        if (status) where.status = status;
        if (category) where.categories = { some: { slug: category } };
        if (tag) where.tags = { some: { slug: tag } };

        return (this.prisma as any).post.findMany({
            where,
            include: {
                author: { select: { name: true, email: true } },
                categories: true,
                tags: true,
                _count: { select: { comments: true } }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(slug: string) {
        const post = await (this.prisma as any).post.findUnique({
            where: { slug },
            include: {
                author: { select: { name: true, email: true } },
                categories: true,
                tags: true,
                comments: { include: { user: true }, orderBy: { createdAt: 'desc' } }
            },
        });

        if (post) {
            const seo = await this.seoMetaService.findByPage('post', post.id);
            return { ...post, seo };
        }
        return null;
    }

    async findById(id: string) {
        const post = await (this.prisma as any).post.findUnique({
            where: { id },
            include: {
                author: { select: { name: true, email: true } },
                categories: true,
                tags: true,
            },
        });

        if (post) {
            const seo = await this.seoMetaService.findByPage('post', post.id);
            return { ...post, seo };
        }
        return null;
    }

    async update(id: string, updatePostDto: any) {
        const { categories, tags, seo, ...postData } = updatePostDto;
        const { title, slug, content, excerpt, coverImage, status, featured, publishedAt } = postData;
        const data: any = {
            title,
            slug,
            content,
            excerpt,
            coverImage,
            status,
            featured,
            publishedAt
        };

        if (categories) {
            data.categories = {
                set: [], // Clear existing relations
                connect: categories.map((id: string) => ({ id }))
            };
        }

        if (tags) {
            data.tags = {
                set: [],
                connectOrCreate: tags.map((tag: string) => ({
                    where: { name: tag },
                    create: { name: tag, slug: tag.toLowerCase().replace(/ /g, '-') }
                }))
            };
        }

        const post = await (this.prisma as any).post.update({
            where: { id },
            data,
        });

        if (seo) {
            await this.seoMetaService.upsert({
                pageType: 'post',
                pageId: post.id,
                title: seo.title,
                description: seo.description
            });
        }

        return post;
    }

    async remove(id: string) {
        return (this.prisma as any).post.delete({
            where: { id },
        });
    }

    // Public methods (no auth required)
    async findPublished(page: number = 1, limit: number = 10, category?: string, tag?: string) {
        const skip = (page - 1) * limit;
        const where: any = { status: 'PUBLISHED' };

        if (category) where.categories = { some: { slug: category } };
        if (tag) where.tags = { some: { slug: tag } };

        const [posts, total] = await Promise.all([
            (this.prisma as any).post.findMany({
                where,
                include: {
                    author: { select: { name: true, avatar: true } },
                    categories: true,
                    tags: true,
                    _count: { select: { comments: true } }
                },
                orderBy: { publishedAt: 'desc' },
                skip,
                take: limit,
            }),
            (this.prisma as any).post.count({ where }),
        ]);

        return {
            posts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findPublishedBySlug(slug: string) {
        const post = await (this.prisma as any).post.findUnique({
            where: { slug, status: 'PUBLISHED' },
            include: {
                author: { select: { name: true, avatar: true, bio: true } },
                categories: true,
                tags: true,
                comments: {
                    where: { status: 'APPROVED' },
                    include: { user: { select: { name: true, avatar: true } } },
                    orderBy: { createdAt: 'desc' }
                },
                _count: { select: { comments: true } }
            },
        });

        if (!post) {
            throw new Error('Post not found');
        }

        // Get related posts (same category, excluding current post)
        const relatedPosts = await (this.prisma as any).post.findMany({
            where: {
                status: 'PUBLISHED',
                id: { not: post.id },
                categories: {
                    some: {
                        id: { in: post.categories.map((c: any) => c.id) }
                    }
                }
            },
            include: {
                author: { select: { name: true, avatar: true } },
                categories: true,
                _count: { select: { comments: true } }
            },
            take: 3,
            orderBy: { publishedAt: 'desc' },
        });

        return {
            ...post,
            seo: await this.seoMetaService.findByPage('post', post.id),
            relatedPosts,
        };
    }
}
