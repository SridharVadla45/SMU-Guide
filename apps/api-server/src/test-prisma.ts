
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking Prisma Client...');
    if ((prisma as any).paymentMethod) {
        console.log('SUCCESS: paymentMethod model exists on Prisma Client.');
    } else {
        console.error('FAILURE: paymentMethod model does NOT exist on Prisma Client.');
        console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('_')));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
