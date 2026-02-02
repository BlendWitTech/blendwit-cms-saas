import { Module } from '@nestjs/common';
import { RobotsService } from './robots.service';
import { RobotsController } from './robots.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
    imports: [PrismaModule, AuditLogModule],
    controllers: [RobotsController],
    providers: [RobotsService],
    exports: [RobotsService],
})
export class RobotsModule { }
