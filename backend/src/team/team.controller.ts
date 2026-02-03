import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';

@UseGuards(PermissionsGuard)
@Controller('team')
export class TeamController {
    constructor(private readonly teamService: TeamService) { }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_CREATE)
    @Post()
    create(@Body() createTeamMemberDto: any) {
        return this.teamService.create(createTeamMemberDto);
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_VIEW)
    @Get()
    findAll() {
        return this.teamService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.teamService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTeamMemberDto: any) {
        return this.teamService.update(id, updateTeamMemberDto);
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.teamService.remove(id);
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_EDIT)
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
