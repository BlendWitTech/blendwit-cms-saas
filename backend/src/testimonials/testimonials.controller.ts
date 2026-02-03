import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { RequirePermissions } from '../auth/permissions.decorator';
import { Permission } from '../auth/permissions.enum';

@UseGuards(PermissionsGuard)
@Controller('testimonials')
export class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) { }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_CREATE)
    @Post()
    create(@Body() createTestimonialDto: any) {
        return this.testimonialsService.create(createTestimonialDto);
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_VIEW)
    @Get()
    findAll() {
        return this.testimonialsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_VIEW)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.testimonialsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_EDIT)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTestimonialDto: any) {
        return this.testimonialsService.update(id, updateTestimonialDto);
    }

    @UseGuards(JwtAuthGuard)
    @RequirePermissions(Permission.CONTENT_DELETE)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.testimonialsService.remove(id);
    }

    // Public routes
    @Get('public/list')
    getPublic() {
        return this.testimonialsService.findAll();
    }

    @Get('public/featured')
    getFeatured(@Query('limit') limit?: string) {
        return this.testimonialsService.findFeatured(limit ? parseInt(limit) : 5);
    }
}
