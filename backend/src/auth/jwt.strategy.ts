import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private usersService: UsersService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'secretKey',
        });
    }

    async validate(payload: any) {
        if (payload.scope === '2fa_pending') {
            throw new UnauthorizedException('Please complete 2FA verification');
        }

        const user = await this.usersService.findOne(payload.email);

        if (!user || user.status === 'DEACTIVATED') {
            throw new UnauthorizedException('Your access has been revoked. Please contact an administrator.');
        }

        // Check Session Locking
        const sessionLocking = await (this.prisma as any).setting.findUnique({ where: { key: 'security_session_locking' } });
        if (sessionLocking?.value === 'true') {
            if (user.lastActive) {
                const diff = Date.now() - new Date(user.lastActive).getTime();
                // 24 hours = 24 * 60 * 60 * 1000 = 86400000 ms
                if (diff > 86400000) {
                    throw new UnauthorizedException('Session expired due to inactivity (24h limit). Please log in again.');
                }
            }

            // Update lastActive if it's been more than 5 minutes to avoid DB spam
            const fiveMins = 5 * 60 * 1000;
            if (!user.lastActive || (Date.now() - new Date(user.lastActive).getTime() > fiveMins)) {
                await this.usersService.updateLastActive(user.id);
            }
        }

        // Return the full user object so guards can access role/permissions
        return user;
    }
}
