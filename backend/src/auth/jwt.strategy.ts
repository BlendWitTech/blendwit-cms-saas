import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usersService: UsersService) {
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

        // Return the full user object so guards can access role/permissions
        return user;
    }
}
