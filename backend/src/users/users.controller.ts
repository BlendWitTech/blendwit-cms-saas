import { Controller, Get, Param, Delete, Query, UseGuards, Patch, Request, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IpGuard } from '../auth/ip.guard';
import { AuditLogService } from '../audit-log/audit-log.service';

import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, IpGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly auditLog: AuditLogService
    ) { }

    @Get('stats')
    @Roles('Super Admin', 'Admin')
    async getStats() {
        return this.usersService.getStats();
    }

    @Get()
    @Roles('Super Admin', 'Admin')
    async findAll(
        @Query('search') search?: string,
        @Query('role') role?: string,
        @Query('status') status?: string,
        @Query('security') security?: string,
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ) {
        const { users, total: usersTotal } = await this.usersService.findAll({
            search,
            role,
            status,
            security,
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 10,
        });

        let userResults = users.map(u => ({ ...u, type: 'User' }));
        let total = usersTotal;

        if (!status || status === 'Pending') {
            const invitations = await this.usersService.findAllInvitations({ search, role });
            total += invitations.length;

            // If we have room in the current page, add invitations
            if (userResults.length < (take || 10)) {
                const remaining = (take || 10) - userResults.length;
                // This is a bit complex for perfect pagination across two sources,
                // but for now, we'll append invitations if on the last page of users
                userResults = [...userResults, ...invitations.slice(0, remaining).map(i => ({ ...i, status: 'Pending', type: 'Invitation' }))];
            }
        }

        return {
            users: userResults,
            total
        };
    }

    @Get('profile')
    async getProfile(@Request() req) {
        const email = req.user?.email;
        if (!email) throw new Error('Unauthorized');
        const user = await this.usersService.findOne(email);
        if (!user) throw new Error('User not found');
        return user;
    }

    @Get('profile/logs')
    async getLogs(@Request() req) {
        const email = req.user?.email;
        if (!email) throw new Error('Unauthorized');
        const user = await this.usersService.findOne(email);
        if (!user) throw new Error('User not found');
        return this.usersService.getActivityLogs(user.id);
    }

    @Patch('profile')
    async updateProfile(@Request() req, @Body() data: any) {
        const email = req.user?.email;
        if (!email) throw new Error('Unauthorized');
        const user = await this.usersService.findOne(email);
        if (!user) throw new Error('User not found');
        const updated = await this.usersService.updateProfile(user.id, data);
        await this.auditLog.log(user.id, 'USER_UPDATE_PROFILE', { changes: Object.keys(data) });
        return updated;
    }

    @Get('logs/all')
    async getAllLogs(
        @Query('skip') skip?: number,
        @Query('take') take?: number,
    ) {
        return this.usersService.getAllActivityLogs({
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 20,
        });
    }

    @Delete(':id')
    @Roles('Super Admin')
    async remove(@Param('id') id: string, @Request() req) {
        // Since delete users endpoint might be used by admins, we should log who deleted whom.
        // Assuming request has user info from JwtAuthGuard
        const res = await this.usersService.remove(id);
        const adminId = req.user?.userId || 'unknown'; // Need to ensure request has user. 
        // Wait, remove doesn't have @Request currently.
        await this.auditLog.log(adminId, 'USER_DELETE', { targetUserId: id });
        return res;
    }
}
