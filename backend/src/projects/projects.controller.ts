import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createProjectDto: any) {
        return this.projectsService.create(createProjectDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('status') status?: string, @Query('category') category?: string, @Query('featured') featured?: string) {
        return this.projectsService.findAll(status, category, featured === 'true');
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProjectDto: any) {
        return this.projectsService.update(id, updateProjectDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectsService.remove(id);
    }

    // Public routes
    @Get('public/list')
    getPublished(@Query('page') page?: string, @Query('limit') limit?: string, @Query('category') category?: string) {
        return this.projectsService.findPublished(
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 10,
            category
        );
    }

    @Get('public/featured')
    getFeatured() {
        return this.projectsService.findFeatured();
    }

    @Get('public/:slug')
    getBySlug(@Param('slug') slug: string) {
        return this.projectsService.findOne(slug);
    }
}
