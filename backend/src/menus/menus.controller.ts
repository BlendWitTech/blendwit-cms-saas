import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MenusService } from './menus.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('menus')
export class MenusController {
    constructor(private readonly menusService: MenusService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createMenuDto: any) {
        return this.menusService.create(createMenuDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.menusService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id') id: string) {
        return this.menusService.findOne(id);
    }

    @Get('slug/:slug')
    findBySlug(@Param('slug') slug: string) {
        return this.menusService.findBySlug(slug);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateMenuDto: any) {
        return this.menusService.update(id, updateMenuDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.menusService.remove(id);
    }
}
