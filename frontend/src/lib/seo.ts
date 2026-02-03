import { Metadata } from 'next';

interface SeoConfig {
    title: string;
    description: string;
    keywords?: string[];
    ogImage?: string;
    ogType?: string;
    canonicalUrl?: string;
    noindex?: boolean;
    nofollow?: boolean;
}

export function generateMetadata(config: SeoConfig): Metadata {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const {
        title,
        description,
        keywords,
        ogImage,
        ogType = 'website',
        canonicalUrl,
        noindex = false,
        nofollow = false,
    } = config;

    const metadata: Metadata = {
        title,
        description,
        keywords: keywords?.join(', '),
        openGraph: {
            title,
            description,
            type: ogType as any,
            images: ogImage ? [{ url: ogImage }] : undefined,
            url: canonicalUrl || baseUrl,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ogImage ? [ogImage] : undefined,
        },
        robots: {
            index: !noindex,
            follow: !nofollow,
        },
    };

    if (canonicalUrl) {
        metadata.alternates = {
            canonical: canonicalUrl,
        };
    }

    return metadata;
}

// JSON-LD Schema Generators
export function generateOrganizationSchema(config: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: config.name,
        url: config.url,
        logo: config.logo,
        description: config.description,
    };
}

export function generateWebSiteSchema(config: {
    name: string;
    url: string;
    description?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: config.name,
        url: config.url,
        description: config.description,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${config.url}/blog?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

export function generateBlogPostingSchema(post: {
    title: string;
    description: string;
    url: string;
    image?: string;
    datePublished: string;
    dateModified: string;
    author: {
        name: string;
        url?: string;
    };
    publisher: {
        name: string;
        logo?: string;
    };
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        image: post.image,
        datePublished: post.datePublished,
        dateModified: post.dateModified,
        author: {
            '@type': 'Person',
            name: post.author.name,
            url: post.author.url,
        },
        publisher: {
            '@type': 'Organization',
            name: post.publisher.name,
            logo: post.publisher.logo
                ? {
                    '@type': 'ImageObject',
                    url: post.publisher.logo,
                }
                : undefined,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': post.url,
        },
    };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function generatePersonSchema(person: {
    name: string;
    url?: string;
    image?: string;
    jobTitle?: string;
    description?: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: person.name,
        url: person.url,
        image: person.image,
        jobTitle: person.jobTitle,
        description: person.description,
    };
}

// Re-export JsonLd component
export { JsonLd } from '@/components/JsonLd';


// SEO Score Calculator
export function calculateSeoScore(content: string, meta: any): {
    score: number;
    suggestions: string[];
    warnings: string[];
} {
    const suggestions: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    // Title checks
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

    // Description checks
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

    // Image checks
    if (!meta?.ogImage) {
        suggestions.push('Add an Open Graph image for better social sharing');
        score -= 5;
    }

    return {
        score: Math.max(0, score),
        suggestions,
        warnings,
    };
}
