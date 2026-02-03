import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createTeamMemberDto: any) {
        return this.teamService.create(createTeamMemberDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.teamService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.teamService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTeamMemberDto: any) {
        return this.teamService.update(id, updateTeamMemberDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.teamService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('reorder')
    reorder(@Body() updates: Array<{ id: string; order: number }>) {
        return this.teamService.reorder(updates);
    }

    // Public route
    @Get('public/list')
    getPublic() {
        return this.teamService.findAll();
    }
}
