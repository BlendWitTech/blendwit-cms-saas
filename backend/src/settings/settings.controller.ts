import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) { }

    @Get()
    findAll() {
        return this.settingsService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    updateMany(@Body() settings: Record<string, string>) {
        // In a real app, we'd check if the user is a Super Admin here
        return this.settingsService.updateMany(settings);
    }
}
