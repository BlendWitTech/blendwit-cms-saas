import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PagesService } from './pages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('pages')
export class PagesController {
    constructor(private readonly pagesService: PagesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createDto: any) {
        return this.pagesService.create(createDto);
    }

    @Get()
    findAll() {
        return this.pagesService.findAll();
    }

    @Get(':id')
    public async findOne(@Param('id') id: string) {
        return this.pagesService.findById(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateDto: any) {
        return this.pagesService.update(id, updateDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.pagesService.remove(id);
    }
}
