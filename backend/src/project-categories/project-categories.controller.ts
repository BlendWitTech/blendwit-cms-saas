import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectCategoriesService } from './project-categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('project-categories')
export class ProjectCategoriesController {
    constructor(private readonly projectCategoriesService: ProjectCategoriesService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createDto: { name: string; description?: string; slug?: string }) {
        return this.projectCategoriesService.create(createDto);
    }

    @Get()
    findAll() {
        return this.projectCategoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectCategoriesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateDto: { name?: string; description?: string; slug?: string }) {
        return this.projectCategoriesService.update(id, updateDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.projectCategoriesService.remove(id);
    }
}
