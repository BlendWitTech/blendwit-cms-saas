import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        const { content, authorName, authorEmail, postId, userId, status } = data;
        return this.prisma.comment.create({
            data: {
                content,
                authorName,
                authorEmail,
                postId,
                userId,
                status: status || 'PENDING'
            }
        });
    }

    async findAll(postId?: string) {
        if (postId) {
            return this.prisma.comment.findMany({
                where: { postId },
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, role: true } } }
            });
        }
        return this.prisma.comment.findMany({
            orderBy: { createdAt: 'desc' },
            include: { post: { select: { title: true, slug: true } } }
        });
    }

    async updateStatus(id: string, status: string) {
        return this.prisma.comment.update({
            where: { id },
            data: { status }
        });
    }

    async remove(id: string) {
        return this.prisma.comment.delete({ where: { id } });
    }
}
