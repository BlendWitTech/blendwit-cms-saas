import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditLogService } from '../audit-log/audit-log.service';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
    constructor(
        private readonly analyticsService: AnalyticsService,
        private readonly auditLog: AuditLogService,
    ) { }

    @Get('config')
    async getConfig() {
        return this.analyticsService.getConfig();
    }

    @Post('config')
    async updateConfig(@Body() data: any, @Request() req) {
        const result = await this.analyticsService.updateConfig(data);
        await this.auditLog.log(req.user.userId, 'ANALYTICS_CONFIG_UPDATE', data);
        return result;
    }

    @Get('dashboard')
    async getDashboard() {
        return this.analyticsService.getDashboardMetrics();
    }
}
