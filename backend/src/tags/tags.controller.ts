import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createTagDto: any) {
        return this.tagsService.create(createTagDto);
    }

    @Get()
    findAll() {
        return this.tagsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tagsService.remove(id);
    }
}
