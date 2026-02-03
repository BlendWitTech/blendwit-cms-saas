import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';

@Controller('leads')
@UseGuards(PermissionsGuard)
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @Post('public/submit')
    createPublic(@Body() createLeadDto: any) {
        return this.leadsService.create(createLeadDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    @RequirePermissions(Permission.LEADS_MANAGE)
    create(@Body() createLeadDto: any) {
        return this.leadsService.create(createLeadDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    @RequirePermissions(Permission.LEADS_VIEW)
    findAll(@Query('status') status?: string) {
        return this.leadsService.findAll(status);
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    @RequirePermissions(Permission.LEADS_VIEW)
    getStats() {
        return this.leadsService.getStats();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    @RequirePermissions(Permission.LEADS_VIEW)
    findOne(@Param('id') id: string) {
        return this.leadsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @RequirePermissions(Permission.LEADS_MANAGE)
    update(@Param('id') id: string, @Body() updateLeadDto: any) {
        return this.leadsService.update(id, updateLeadDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    @RequirePermissions(Permission.LEADS_MANAGE)
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.leadsService.updateStatus(id, status);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @RequirePermissions(Permission.LEADS_MANAGE) // Could use LEADS_DELETE if exists, relying on MANAGE for now per enum analysis
    remove(@Param('id') id: string) {
        return this.leadsService.remove(id);
    }
}
