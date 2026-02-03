import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

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

        // Check for deactivation
        if (user.status === 'DEACTIVATED') {
            throw new UnauthorizedException('Your account has been deactivated. Please contact an administrator.');
        }

        // Check for lockout
        if (user.lockoutUntil && user.lockoutUntil > new Date()) {
            throw new UnauthorizedException(`Account is temporarily locked due to multiple failed login attempts. Please try again in ${duration} minutes.`);
        }

        if (await bcrypt.compare(pass, user.password)) {
            // Reset failed attempts and update lastActive on success
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: 0,
                    lockoutUntil: null,
                    lastActive: new Date()
                },
            });

            await this.auditLogService.log(user.id, 'LOGIN_SUCCESS', { ip: 'unknown' });
            const { password, ...result } = user;
            return result;
        }

        // Increment failed attempts
        const attempts = user.failedLoginAttempts + 1;
        const lockoutUntil = attempts >= threshold ? new Date(Date.now() + duration * 60 * 1000) : null;

        await this.prisma.user.update({
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

    async registerWithInvitation(token: string, userData: { name: string; password: string }) {
        const invitation = await (this.prisma as any).invitation.findUnique({
            where: { token },
        });

        if (!invitation || invitation.status !== 'PENDING' || invitation.expiresAt < new Date()) {
            throw new BadRequestException('Invalid or expired invitation token.');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);

        let finalRoleId = invitation.roleId;

        // Fallback: If roleId is not a UUID, it might be a role name (legacy invitation)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(finalRoleId)) {
            this.logger.warn(`Legacy invitation detected for ${invitation.email}. roleId "${finalRoleId}" is not a UUID. Attempting name lookup.`);
            const role = await (this.prisma as any).role.findUnique({
                where: { name: finalRoleId }
            });
            if (role) {
                finalRoleId = role.id;
            } else {
                throw new BadRequestException(`Role "${finalRoleId}" no longer exists.`);
            }
        }

        const user = await this.prisma.user.create({
            data: {
                email: invitation.email,
                name: userData.name,
                password: hashedPassword,
                roleId: finalRoleId,
                ipWhitelist: invitation.ipWhitelist,
            },
        });

        await (this.prisma as any).invitation.update({
            where: { id: invitation.id },
            data: { status: 'ACCEPTED' },
        });

        await this.auditLogService.log(user.id, 'USER_REGISTERED_INVITATION', { email: user.email });

        return user;
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
