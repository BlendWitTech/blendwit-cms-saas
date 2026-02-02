import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RobotsService {
    constructor(private prisma: PrismaService) { }

    async getRobotsTxt() {
        const robot = await this.prisma.robotsTxt.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });

        if (!robot) {
            // Return default robots.txt
            return this.getDefaultRobotsTxt();
        }

        return robot.content;
    }

    async updateRobotsTxt(content: string) {
        // Deactivate all existing robots.txt
        await this.prisma.robotsTxt.updateMany({
            data: { isActive: false },
        });

        // Create new active robots.txt
        return this.prisma.robotsTxt.create({
            data: {
                content,
                isActive: true,
            },
        });
    }

    async getConfig() {
        return this.prisma.robotsTxt.findFirst({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    private getDefaultRobotsTxt(): string {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        return `# Blendwit CMS - Robots.txt
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-index.xml

# Disallow admin areas
Disallow: /dashboard/
Disallow: /login/
Disallow: /api/
`;
    }
}
