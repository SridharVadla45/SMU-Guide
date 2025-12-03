
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to database...');
    try {
        await prisma.$connect();
        console.log('Connected.');

        // Check if PaymentMethod table exists by trying to count
        // We use $queryRaw to check table existence if possible, or just try to access it

        console.log('Checking PaymentMethod model...');
        try {
            const count = await prisma.paymentMethod.count();
            console.log(`SUCCESS: Found ${count} payment methods.`);
        } catch (e) {
            console.error('FAILURE: Could not access PaymentMethod model.');
            console.error(e);
        }

    } catch (e) {
        console.error('Database connection failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
