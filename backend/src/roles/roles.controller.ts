import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IpGuard } from '../auth/ip.guard';

import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';

@UseGuards(JwtAuthGuard, IpGuard, PermissionsGuard)
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    @RequirePermissions(Permission.ROLES_CREATE)
    create(@Body() createRoleDto: CreateRoleDto) {
        return this.rolesService.create(createRoleDto);
    }

    @Get()
    @RequirePermissions(Permission.ROLES_VIEW)
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    @RequirePermissions(Permission.ROLES_VIEW)
    findOne(@Param('id') id: string) {
        return this.rolesService.findOne(id);
    }

    @Patch(':id')
    @RequirePermissions(Permission.ROLES_EDIT)
    update(@Param('id') id: string, @Body() updateRoleDto: Partial<CreateRoleDto>) {
        return this.rolesService.update(id, updateRoleDto);
    }

    @Delete(':id')
    @RequirePermissions(Permission.ROLES_DELETE)
    remove(@Param('id') id: string) {
        return this.rolesService.remove(id);
    }
}
