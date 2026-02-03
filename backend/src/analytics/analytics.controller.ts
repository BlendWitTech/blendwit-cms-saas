import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditLogService } from '../audit-log/audit-log.service';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';

@Controller('analytics')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AnalyticsController {
    constructor(
        private readonly analyticsService: AnalyticsService,
        private readonly auditLog: AuditLogService,
    ) { }

    @Get('config')
    @RequirePermissions(Permission.SETTINGS_EDIT)
    async getConfig() {
        return this.analyticsService.getConfig();
    }

    @Post('config')
    @RequirePermissions(Permission.SETTINGS_EDIT)
    async updateConfig(@Body() data: any, @Request() req) {
        const result = await this.analyticsService.updateConfig(data);
        await this.auditLog.log(req.user.userId, 'ANALYTICS_CONFIG_UPDATE', data);
        return result;
    }

    @Get('dashboard')
    @RequirePermissions(Permission.ANALYTICS_VIEW)
    async getDashboard() {
        return this.analyticsService.getDashboardMetrics();
    }
}
