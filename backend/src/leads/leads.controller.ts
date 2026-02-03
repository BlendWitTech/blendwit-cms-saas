import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @Post('public/submit')
    createPublic(@Body() createLeadDto: any) {
        return this.leadsService.create(createLeadDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createLeadDto: any) {
        return this.leadsService.create(createLeadDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('status') status?: string) {
        return this.leadsService.findAll(status);
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    getStats() {
        return this.leadsService.getStats();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.leadsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateLeadDto: any) {
        return this.leadsService.update(id, updateLeadDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.leadsService.updateStatus(id, status);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.leadsService.remove(id);
    }
}
