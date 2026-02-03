import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Initializing role levels...');

    await prisma.role.updateMany({
        where: { name: 'Super Admin' },
        data: { level: 0 }
    });

    await prisma.role.updateMany({
        where: { name: 'Admin' },
        data: { level: 1 }
    });

    // Set others to 10 if they were 0 or undefined
    await prisma.role.updateMany({
        where: {
            NOT: {
                name: { in: ['Super Admin', 'Admin'] }
            },
            level: 0
        },
        data: { level: 10 }
    });

    console.log('Roles levels initialized successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
