import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('timeline')
export class TimelineController {
    constructor(private readonly timelineService: TimelineService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createMilestoneDto: any) {
        return this.timelineService.create(createMilestoneDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.timelineService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.timelineService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMilestoneDto: any) {
        return this.timelineService.update(id, updateMilestoneDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.timelineService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
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
