import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AccessControlModule } from './auth/access-control.module';
import { UsersModule } from './users/users.module';
import { SettingsModule } from './settings/settings.module';
import { InvitationsModule } from './invitations/invitations.module';
import { RolesModule } from './roles/roles.module';
import { BlogsModule } from './blogs/blogs.module';
import { CategoriesModule } from './categories/categories.module';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';
import { MediaModule } from './media/media.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailModule } from './mail/mail.module';
import { SeoMetaModule } from './seo-meta/seo-meta.module';
import { RedirectsModule } from './redirects/redirects.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { SitemapModule } from './sitemap/sitemap.module';
import { RobotsModule } from './robots/robots.module';
import { MenusModule } from './menus/menus.module';
import { ProjectsModule } from './projects/projects.module';
import { TeamModule } from './team/team.module';
import { TimelineModule } from './timeline/timeline.module';
import { ServicesModule } from './services/services.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { LeadsModule } from './leads/leads.module';
import { ProjectCategoriesModule } from './project-categories/project-categories.module';
import { PagesModule } from './pages/pages.module';
import { ThemesModule } from './themes/themes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AccessControlModule,
    AuthModule,
    RolesModule,
    SettingsModule,
    MediaModule,
    TagsModule,
    CategoriesModule,
    CommentsModule,
    BlogsModule,
    InvitationsModule,
    AuditLogModule,
    MailModule,
    SeoMetaModule,
    RedirectsModule,
    AnalyticsModule,
    SitemapModule,
    RobotsModule,
    MenusModule,
    ProjectsModule,
    TeamModule,
    TimelineModule,
    ServicesModule,
    TestimonialsModule,
    LeadsModule,
    ProjectCategoriesModule,
    PagesModule,
    ThemesModule,
    NotificationsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

