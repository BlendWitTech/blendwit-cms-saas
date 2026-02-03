import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditLogService } from '../audit-log/audit-log.service';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';

@Controller('categories')
@UseGuards(PermissionsGuard)
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly auditLog: AuditLogService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @RequirePermissions(Permission.CONTENT_CREATE)
    async create(@Body() createCategoryDto: any, @Request() req) {
        const cat = await this.categoriesService.create(createCategoryDto);
        await this.auditLog.log(req.user.userId, 'CATEGORY_CREATE', { name: cat.name });
        return cat;
    }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    @RequirePermissions(Permission.CONTENT_EDIT)
    async update(@Param('id') id: string, @Body() updateCategoryDto: any, @Request() req) {
        const cat = await this.categoriesService.update(id, updateCategoryDto);
        await this.auditLog.log(req.user.userId, 'CATEGORY_UPDATE', { id, name: cat.name });
        return cat;
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    @RequirePermissions(Permission.CONTENT_DELETE)
    async remove(@Param('id') id: string, @Request() req) {
        const res = await this.categoriesService.remove(id);
        await this.auditLog.log(req.user.userId, 'CATEGORY_DELETE', { id });
        return res;
    }
}
