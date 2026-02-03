import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SeoMetaModule } from '../seo-meta/seo-meta.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [PrismaModule, SeoMetaModule, UsersModule],
    controllers: [PagesController],
    providers: [PagesService],
})
export class PagesModule { }
