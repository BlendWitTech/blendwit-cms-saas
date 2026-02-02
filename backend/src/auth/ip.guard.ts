import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class IpGuard implements CanActivate {
    constructor(private usersService: UsersService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) return true; // If not authenticated, let AuthGuard handle it

        const userDetails = await this.usersService.findOne(user.email);
        if (!userDetails || userDetails.ipWhitelist.length === 0) {
            return true; // No IP restriction
        }

        const clientIp = request.ip || request.connection.remoteAddress;

        // Handle local development IPs and potential proxy headers if needed
        // For now, simple check
        if (userDetails.ipWhitelist.includes(clientIp)) {
            return true;
        }

        throw new ForbiddenException(`Access denied from IP: ${clientIp}`);
    }
}
