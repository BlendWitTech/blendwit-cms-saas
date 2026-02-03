import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createServiceDto: any) {
        return this.servicesService.create(createServiceDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.servicesService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.servicesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateServiceDto: any) {
        return this.servicesService.update(id, updateServiceDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.servicesService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('reorder')
    reorder(@Body() updates: Array<{ id: string; order: number }>) {
        return this.servicesService.reorder(updates);
    }

    // Public route
    @Get('public/list')
    getPublic() {
        return this.servicesService.findAll();
    }
}
