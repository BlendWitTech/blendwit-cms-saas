import { Controller, Post, UseInterceptors, UploadedFile, Get, BadRequestException, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ThemesService } from './themes.service';

@Controller('themes')
export class ThemesController {
    constructor(private readonly themesService: ThemesService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadTheme(@UploadedFile() file: Express.Multer.File) {
        return this.themesService.processThemeUpload(file);
    }

    @Get()
    async listThemes() {
        return this.themesService.listThemes();
    }

    @Get('active')
    async getActiveTheme() {
        return { activeTheme: await this.themesService.getActiveTheme() };
    }

    @Post(':name/setup')
    async setupTheme(@Param('name') name: string) {
        return this.themesService.setupTheme(name);
    }

    @Post(':name/activate')
    async activateTheme(@Param('name') name: string) {
        return this.themesService.setActiveTheme(name);
    }
}
