import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
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

@Module({
  imports: [
    PrismaModule,
    UsersModule,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
