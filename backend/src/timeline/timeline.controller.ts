import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';

@UseGuards(PermissionsGuard)
@Controller('timeline')
export class TimelineController {
    constructor(private readonly timelineService: TimelineService) { }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_CREATE)
    @Post()
    create(@Body() createMilestoneDto: any) {
        return this.timelineService.create(createMilestoneDto);
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_VIEW)
    @Get()
    findAll() {
        return this.timelineService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.timelineService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMilestoneDto: any) {
        return this.timelineService.update(id, updateMilestoneDto);
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.timelineService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_EDIT)
    @Post('reorder')
    reorder(@Body() updates: Array<{ id: string; order: number }>) {
        return this.timelineService.reorder(updates);
    }

    // Public route
    @Get('public/list')
    getPublic() {
        return this.timelineService.findAll();
    }
}
