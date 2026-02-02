import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(filters: { search?: string, role?: string, status?: string, security?: string, skip?: number, take?: number }): Promise<{ users: User[], total: number }> {
        const where: Prisma.UserWhereInput = {};

        if (filters.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
                { ipWhitelist: { has: filters.search } },
            ];
        }

        if (filters.role) {
            where.role = { name: filters.role };
        }

        if (filters.security) {
            if (filters.security === '2FA') {
                where.twoFactorEnabled = true;
            } else if (filters.security === 'IP') {
                where.ipWhitelist = { isEmpty: false };
            }
        }

        const [users, total] = await Promise.all([
            (this.prisma as any).user.findMany({
                where,
                include: { role: true },
                orderBy: { createdAt: 'desc' },
                skip: filters.skip || 0,
                take: filters.take || 10,
            }),
            (this.prisma as any).user.count({ where }),
        ]);

        return { users, total };
    }

    async getStats() {
        const [total, active, recent, pending] = await Promise.all([
            (this.prisma as any).user.count(),
            (this.prisma as any).user.count({ where: { forcePasswordChange: false } }), // Using forcePasswordChange as proxy for active for now or actual session data later
            (this.prisma as any).user.count({
                where: {
                    createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
                }
            }),
            (this.prisma as any).invitation.count({ where: { status: 'PENDING' } }),
        ]);

        return { total, active, recent, pending };
    }

    async remove(id: string): Promise<User> {
        return (this.prisma as any).user.delete({
            where: { id },
        });
    }

    async updateTwoFactorSecret(userId: string, secret: string): Promise<User> {
        return (this.prisma as any).user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret },
        });
    }

    async enableTwoFactor(userId: string): Promise<User> {
        return (this.prisma as any).user.update({
            where: { id: userId },
            data: { twoFactorEnabled: true },
        });
    }

    async findAllInvitations(filters: { search?: string, role?: string }): Promise<any[]> {
        const where: any = { status: 'PENDING' };

        if (filters.search) {
            where.OR = [
                { email: { contains: filters.search, mode: 'insensitive' } },
                { ipWhitelist: { has: filters.search } },
            ];
        }

        if (filters.role) {
            where.roleId = filters.role; // Assuming role name for now, but should be ID
        }

        return (this.prisma as any).invitation.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateProfile(id: string, data: { name?: string; bio?: string; avatar?: string; forcePasswordChange?: boolean; preferences?: any }) {
        const { name, bio, avatar, forcePasswordChange, preferences } = data;
        return (this.prisma as any).user.update({
            where: { id },
            data: { name, bio, avatar, forcePasswordChange, preferences },
        });
    }

    async getActivityLogs(userId: string) {
        return (this.prisma as any).activityLog.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });
    }

    async getAllActivityLogs(filters: { skip?: number, take?: number }) {
        const [logs, total] = await Promise.all([
            (this.prisma as any).activityLog.findMany({
                include: { user: { select: { name: true, email: true } } },
                orderBy: { createdAt: 'desc' },
                skip: filters.skip || 0,
                take: filters.take || 20,
            }),
            (this.prisma as any).activityLog.count(),
        ]);
        return { logs, total };
    }

    async findOne(email: string): Promise<User | null> {
        return (this.prisma as any).user.findUnique({
            where: { email },
            include: { role: true },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return (this.prisma as any).user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
        });
    }
}
