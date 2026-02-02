import { Controller, Get, Header } from '@nestjs/common';
import { SitemapService } from './sitemap.service';

@Controller()
export class SitemapController {
    constructor(private readonly sitemapService: SitemapService) { }

    @Get('sitemap.xml')
    @Header('Content-Type', 'application/xml')
    async getSitemap() {
        return this.sitemapService.generateSitemap();
    }

    @Get('sitemap-posts.xml')
    @Header('Content-Type', 'application/xml')
    async getPostsSitemap() {
        return this.sitemapService.generatePostsSitemap();
    }

    @Get('sitemap-index.xml')
    @Header('Content-Type', 'application/xml')
    async getSitemapIndex() {
        return this.sitemapService.generateSitemapIndex();
    }
}
