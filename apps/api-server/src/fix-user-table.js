
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Checking User table for missing columns...');
    try {
        // Try to select stripeCustomerId to see if it exists
        await prisma.$queryRaw`SELECT stripeCustomerId FROM User LIMIT 1`;
        console.log('stripeCustomerId column exists.');
    } catch (e) {
        console.log('stripeCustomerId column missing. Adding it...');
        try {
            await prisma.$executeRawUnsafe(`
          ALTER TABLE User 
          ADD COLUMN stripeCustomerId VARCHAR(191) NULL;
        `);
            console.log('SUCCESS: Added stripeCustomerId to User table.');
        } catch (addError) {
            console.error('FAILED to add column:', addError);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
