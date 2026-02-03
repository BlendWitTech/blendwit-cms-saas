import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
        private auditLogService: AuditLogService
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        const settings = await (this.prisma as any).setting.findMany();
        const settingsMap = settings.reduce((acc: any, s: any) => ({ ...acc, [s.key]: s.value }), {});

        const threshold = parseInt(settingsMap['lockout_threshold'] || '5');
        const duration = parseInt(settingsMap['lockout_duration'] || '15'); // in minutes

        if (!user) return null;

        // Check for lockout
        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
            throw new UnauthorizedException(`Account is temporarily locked due to multiple failed login attempts. Please try again in ${duration} minutes.`);
        }

        if (await bcrypt.compare(pass, user.password)) {
            // Reset failed attempts on success
            await (this.prisma as any).user.update({
                where: { id: user.id },
                data: { failedLoginAttempts: 0, lockoutUntil: null },
            });

            await this.auditLogService.log(user.id, 'LOGIN_SUCCESS', { ip: 'unknown' });
            const { password, ...result } = user;
            return result;
        }

        // Increment failed attempts
        const attempts = user.failedLoginAttempts + 1;
        const lockoutUntil = attempts >= threshold ? new Date(Date.now() + duration * 60 * 1000) : null;

        await (this.prisma as any).user.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: attempts,
                lockoutUntil
            },
        });

        await this.auditLogService.log(user.id, 'LOGIN_FAILURE', { attempts }, 'DANGER');
        return null;
    }



    async login(user: any, rememberMe: boolean = false) {
        if (user.twoFactorEnabled) {
            const tempPayload = { email: user.email, sub: user.id, scope: '2fa_pending' };
            return {
                requires2fa: true,
                temp_token: this.jwtService.sign(tempPayload, { expiresIn: '5m' }),
            };
        }

        const payload = {
            email: user.email,
            sub: user.id,
            role: (user as any).role.name,
            forcePasswordChange: user.forcePasswordChange
        };

        const jwtOptions = rememberMe ? { expiresIn: '30d' } : {};

        return {
            access_token: this.jwtService.sign(payload, jwtOptions as any),
            forcePasswordChange: user.forcePasswordChange
        };
    }

    async changePassword(userId: string, newPass: string) {
        const hashedPassword = await bcrypt.hash(newPass, 10);
        return (this.prisma as any).user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                forcePasswordChange: false
            },
        });
    }

    async register(userData: any) {
        let role = await (this.prisma as any).role.findFirst({ where: { name: 'Admin' } });
        if (!role) {
            role = await (this.prisma as any).role.create({
                data: {
                    name: 'Admin',
                    permissions: {},
                },
            });
        }

        const { email, password, name } = userData;
        return this.usersService.create({
            email,
            password,
            name,
            role: { connect: { id: role.id } },
        });
    }
    async forgotPassword(email: string) {
        const user = await this.usersService.findOne(email);
        if (!user) return { message: 'If user exists, email sent' };

        const token = Math.random().toString(36).substring(2, 15);
        await this.auditLogService.log(user.id, 'PASSWORD_RESET_REQUEST', { token }, 'WARNING');

        // In production, an actual email would be sent here
        return { message: 'If user exists, email sent' };
    }

    async resetPassword(email: string, token: string, newPass: string) {
        const user = await this.usersService.findOne(email);
        if (!user) throw new UnauthorizedException('Invalid token or user');

        const hashedPassword = await bcrypt.hash(newPass, 10);
        await (this.prisma as any).user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        await this.auditLogService.log(user.id, 'PASSWORD_RESET_SUCCESS');
        return { message: 'Password reset successfully' };
    }
}
