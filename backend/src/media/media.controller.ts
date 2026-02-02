import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Delete,
    Param,
    UseInterceptors,
    UploadedFiles,
    UseGuards,
    Request,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IpGuard } from '../auth/ip.guard';
import { AuditLogService } from '../audit-log/audit-log.service';

@UseGuards(JwtAuthGuard, IpGuard)
@Controller('media')
export class MediaController {
    constructor(
        private readonly mediaService: MediaService,
        private readonly auditLog: AuditLogService
    ) { }

    @Get()
    findAll() {
        return this.mediaService.findAll();
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: { altText?: string, folder?: string }) {
        return this.mediaService.update(id, data);
    }

    @Post('upload')
    @UseInterceptors(
        FilesInterceptor('files', 10, { // Allow up to 10 files
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const randomName = Array(32)
                        .fill(null)
                        .map(() => Math.round(Math.random() * 16).toString(16))
                        .join('');
                    cb(null, `${randomName}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async uploadFiles(@UploadedFiles() files: Express.Multer.File[], @Request() req) {
        const results: any[] = [];
        for (const file of files) {
            const result = await this.mediaService.create(file);
            results.push(result);
        }
        await this.auditLog.log(req.user.userId, 'MEDIA_UPLOAD', { count: files.length, filenames: files.map(f => f.originalname) });
        return results;
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req) {
        const res = await this.mediaService.remove(id);
        await this.auditLog.log(req.user.userId, 'MEDIA_DELETE', { id });
        return res;
    }

    @Post('migrate')
    async migrate(@Request() req) {
        const results = await this.mediaService.migrateLocalToCloud();
        await this.auditLog.log(req.user.userId, 'MEDIA_MIGRATE_TO_CLOUD', results);
        return results;
    }
}
