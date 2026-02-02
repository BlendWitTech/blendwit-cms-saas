import { Controller, Get, Post, Body, Header, UseGuards, Request } from '@nestjs/common';
import { RobotsService } from './robots.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditLogService } from '../audit-log/audit-log.service';

@Controller()
export class RobotsController {
    constructor(
        private readonly robotsService: RobotsService,
        private readonly auditLog: AuditLogService,
    ) { }

    @Get('robots.txt')
    @Header('Content-Type', 'text/plain')
    async getRobotsTxt() {
        return this.robotsService.getRobotsTxt();
    }

    @Get('api/robots')
    @UseGuards(JwtAuthGuard)
    async getConfig() {
        return this.robotsService.getConfig();
    }

    @Post('api/robots')
    @UseGuards(JwtAuthGuard)
    async updateRobotsTxt(@Body() data: { content: string }, @Request() req) {
        const result = await this.robotsService.updateRobotsTxt(data.content);
        await this.auditLog.log(req.user.userId, 'ROBOTS_TXT_UPDATE', {});
        return result;
    }
}
