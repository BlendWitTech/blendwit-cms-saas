import { Module } from '@nestjs/common';
import { SeoMetaService } from './seo-meta.service';
import { SeoMetaController } from './seo-meta.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [PrismaModule, AuditLogModule],
    controllers: [SeoMetaController],
    providers: [SeoMetaService],
    exports: [SeoMetaService],
})
export class SeoMetaModule { }
