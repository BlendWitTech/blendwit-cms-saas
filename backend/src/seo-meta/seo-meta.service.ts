import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeoMetaService {
    constructor(private prisma: PrismaService) { }

    async findByPage(pageType: string, pageId?: string) {
        return this.prisma.seoMeta.findUnique({
            where: {
                pageType_pageId: {
                    pageType,
                    pageId: (pageId || null) as any, // Cast to any to bypass strict typing issues (schema allows null)
                },
            },
        });
    }

    async upsert(data: any) {
        const { pageType, pageId, ...rest } = data;

        return this.prisma.seoMeta.upsert({
            where: {
                pageType_pageId: {
                    pageType,
                    pageId: (pageId || null) as any,
                },
            },
            update: rest,
            create: data,
        });
    }

    async delete(id: string) {
        return this.prisma.seoMeta.delete({
            where: { id },
        });
    }

    async analyzeSeo(content: string, meta: any) {
        const suggestions: string[] = [];
        const warnings: string[] = [];
        let score = 100;

        // Title analysis
        if (!meta?.title) {
            warnings.push('Missing meta title');
            score -= 15;
        } else if (meta.title.length < 30) {
            suggestions.push('Title is too short (recommended: 50-60 characters)');
            score -= 5;
        } else if (meta.title.length > 60) {
            warnings.push('Title is too long (recommended: 50-60 characters)');
            score -= 10;
        }

        // Description analysis
        if (!meta?.description) {
            warnings.push('Missing meta description');
            score -= 15;
        } else if (meta.description.length < 120) {
            suggestions.push('Description is too short (recommended: 150-160 characters)');
            score -= 5;
        } else if (meta.description.length > 160) {
            warnings.push('Description is too long (recommended: 150-160 characters)');
            score -= 10;
        }

        // Open Graph
        if (!meta?.ogImage) {
            suggestions.push('Add an Open Graph image for better social sharing');
            score -= 5;
        }

        // Content analysis
        const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
        const h1Count = (content.match(/<h1[^>]*>.*?<\/h1>/gi) || []).length;

        if (h1Count === 0) {
            warnings.push('Missing H1 heading');
            score -= 10;
        } else if (h1Count > 1) {
            warnings.push('Multiple H1 headings found (should have only one)');
            score -= 5;
        }

        if (headings.length < 2) {
            suggestions.push('Add more headings to improve content structure');
            score -= 3;
        }

        // Image alt text
        const images = content.match(/<img[^>]*>/gi) || [];
        const imagesWithoutAlt = images.filter(img => !img.includes('alt=')).length;
        if (imagesWithoutAlt > 0) {
            warnings.push(`${imagesWithoutAlt} image(s) missing alt text`);
            score -= Math.min(imagesWithoutAlt * 2, 10);
        }

        // Links
        const links = content.match(/<a[^>]*href=[^>]*>/gi) || [];
        const externalLinks = links.filter(link => link.includes('http')).length;
        if (links.length === 0) {
            suggestions.push('Consider adding internal links to improve SEO');
            score -= 3;
        }

        // Content length
        const wordCount = content.split(/\s+/).length;
        if (wordCount < 300) {
            suggestions.push('Content is short (recommended: 300+ words for better SEO)');
            score -= 5;
        }

        return {
            score: Math.max(0, score),
            suggestions,
            warnings,
            stats: {
                titleLength: meta?.title?.length || 0,
                descriptionLength: meta?.description?.length || 0,
                h1Count,
                headingCount: headings.length,
                imageCount: images.length,
                imagesWithoutAlt,
                linkCount: links.length,
                externalLinkCount: externalLinks,
                wordCount,
            },
        };
    }
}
