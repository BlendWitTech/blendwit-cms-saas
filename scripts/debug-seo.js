
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DEBUG SEO ---');

    // 1. Get the last updated page
    const page = await prisma.page.findFirst({
        orderBy: { updatedAt: 'desc' }
    });

    if (!page) {
        console.log('No pages found.');
        return;
    }

    console.log('Latest Page:', {
        id: page.id,
        title: page.title,
        slug: page.slug,
        description: page.description // Check Page model description
    });

    // 2. Check SeoMeta for this page
    const seo = await prisma.seoMeta.findFirst({
        where: {
            pageType: 'page',
            pageId: page.id
        }
    });

    console.log('SeoMeta for Page:', seo);

}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
