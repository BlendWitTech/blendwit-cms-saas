import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
    constructor(private prisma: PrismaService) { }

    async log(userId: string, action: string, metadata?: any, status: 'INFO' | 'WARNING' | 'DANGER' = 'INFO') {
        return this.prisma.activityLog.create({
            data: {
                userId,
                action,
                metadata: metadata || {},
                status,
            },
        });
    }

    async findAll(userId?: string, limit = 50) {
        const whereClause = userId ? { userId } : {};

        return this.prisma.activityLog.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                user: {
                    select: { name: true, email: true, role: true }
                }
            }
        });
    }
}
