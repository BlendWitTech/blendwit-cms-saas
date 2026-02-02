import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { RedirectsService } from './redirects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditLogService } from '../audit-log/audit-log.service';

@Controller('redirects')
@UseGuards(JwtAuthGuard)
export class RedirectsController {
    constructor(
        private readonly redirectsService: RedirectsService,
        private readonly auditLog: AuditLogService,
    ) { }

    @Get()
    async findAll() {
        return this.redirectsService.findAll();
    }

    @Get('check/:path')
    async checkRedirect(@Param('path') path: string) {
        return this.redirectsService.checkRedirect(path);
    }

    @Post()
    async create(@Body() data: any, @Request() req) {
        const result = await this.redirectsService.create(data);
        await this.auditLog.log(
            req.user.userId,
            'REDIRECT_CREATE',
            { fromPath: data.fromPath, toPath: data.toPath },
        );
        return result;
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: any, @Request() req) {
        const result = await this.redirectsService.update(id, data);
        await this.auditLog.log(req.user.userId, 'REDIRECT_UPDATE', { id });
        return result;
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Request() req) {
        const result = await this.redirectsService.delete(id);
        await this.auditLog.log(req.user.userId, 'REDIRECT_DELETE', { id });
        return result;
    }
}
