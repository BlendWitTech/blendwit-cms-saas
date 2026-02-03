import { Module } from '@nestjs/common';
import { ThemesController } from './themes.controller';
import { ThemesService } from './themes.service';
import { PrismaModule } from '../prisma/prisma.module';
import { MenusModule } from '../menus/menus.module';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectCategoriesModule } from '../project-categories/project-categories.module';
import { TestimonialsModule } from '../testimonials/testimonials.module';
import { TeamModule } from '../team/team.module';
import { ServicesModule } from '../services/services.module';
import { TimelineModule } from '../timeline/timeline.module';
import { PagesModule } from '../pages/pages.module';

@Module({
    imports: [
        PrismaModule,
        MenusModule,
        ProjectsModule,
        ProjectCategoriesModule,
        TestimonialsModule,
        TeamModule,
        ServicesModule,
        TimelineModule,
        PagesModule,
    ],
    controllers: [ThemesController],
    providers: [ThemesService],
})
export class ThemesModule { }
