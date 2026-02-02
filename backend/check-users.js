const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({ include: { role: true } });
    console.log('--- USERS ---');
    users.forEach(u => {
        console.log(`Email: ${u.email}, Role: ${u.role?.name}, ID: ${u.id}`);
    });

    const roles = await prisma.role.findMany();
    console.log('--- ROLES ---');
    roles.forEach(r => {
        console.log(`Name: ${r.name}, ID: ${r.id}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
