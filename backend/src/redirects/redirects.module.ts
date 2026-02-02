import { Module } from '@nestjs/common';
import { RedirectsService } from './redirects.service';
import { RedirectsController } from './redirects.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [PrismaModule, AuditLogModule],
    controllers: [RedirectsController],
    providers: [RedirectsService],
    exports: [RedirectsService],
})
export class RedirectsModule { }
