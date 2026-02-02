const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const media = await prisma.media.findMany();
    console.log(JSON.stringify(media, null, 2));
    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
