import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async create(data: {
        userId?: string;
        type: 'INFO' | 'WARNING' | 'SUCCESS' | 'DANGER';
        title: string;
        message: string;
        link?: string;
        targetRole?: string;
    }) {
        return (this.prisma as any).notification.create({
            data: {
                ...data,
                isRead: false
            }
        });
    }

    async findAllForUser(userId: string, targetRole: string) {
        return (this.prisma as any).notification.findMany({
            where: {
                OR: [
                    { userId },
                    {
                        userId: null,
                        OR: [
                            { targetRole: null },
                            { targetRole }
                        ]
                    }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    }

    async markAsRead(id: string) {
        return (this.prisma as any).notification.update({
            where: { id },
            data: { isRead: true }
        });
    }

    async getUnreadCount(userId: string, targetRole: string) {
        return (this.prisma as any).notification.count({
            where: {
                OR: [
                    { userId },
                    {
                        userId: null,
                        OR: [
                            { targetRole: null },
                            { targetRole }
                        ]
                    }
                ],
                isRead: false
            }
        });
    }
}
