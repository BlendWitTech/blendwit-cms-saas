import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
export class AuditLogController {
    constructor(private readonly auditLogService: AuditLogService) { }

    @Get()
    async getLogs(@Request() req, @Query('limit') limit: string) {
        const user = req.user;
        const limitNum = limit ? parseInt(limit) : 50;

        // Check if user is SuperAdmin or Admin
        // Using loose check or strictly checking role name
        const isAdmin = user.role === 'Admin' || user.role === 'SuperAdmin';

        if (isAdmin) {
            // Admins see everything
            return this.auditLogService.findAll(undefined, limitNum);
        } else {
            // Users see only their own
            return this.auditLogService.findAll(user.sub, limitNum);
        }
    }
}
