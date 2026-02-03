import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';

@Controller('tags')
@UseGuards(PermissionsGuard)
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @RequirePermissions(Permission.CONTENT_CREATE)
    create(@Body() createTagDto: any) {
        return this.tagsService.create(createTagDto);
    }

    @Get()
    findAll() {
        return this.tagsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @RequirePermissions(Permission.CONTENT_DELETE)
    remove(@Param('id') id: string) {
        return this.tagsService.remove(id);
    }
}
