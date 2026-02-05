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
        try {
            const result = await this.analyticsService.updateConfig(data);
            await this.auditLog.log(req.user.id, 'ANALYTICS_CONFIG_UPDATE', data);
            return result;
        } catch (err) {
            console.error('Error in AnalyticsController.updateConfig:', err);
            throw err;
        }
    }

    @Post('test')
    @RequirePermissions(Permission.SETTINGS_EDIT)
    async testConfig(@Body() data: any) {
        return this.analyticsService.testConnection(data);
    }

    @Get('dashboard')
    @RequirePermissions(Permission.ANALYTICS_VIEW)
    async getDashboard() {
        try {
            return await this.analyticsService.getDashboardMetrics();
        } catch (error) {
            // We want to return the error message so the frontend can display it
            // Instead of throwing 500, we might want to return a specific structure or
            // just let the global exception filter handle it.
            // But since we want the dashboard to show "Error loading data" with a specific reason:
            throw error;
        }
    }
}
