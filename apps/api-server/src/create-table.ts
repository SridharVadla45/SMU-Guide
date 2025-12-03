
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating PaymentMethod table manually...');
    try {
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS PaymentMethod (
        id INTEGER NOT NULL AUTO_INCREMENT,
        userId INTEGER NOT NULL,
        type VARCHAR(191) NOT NULL DEFAULT 'card',
        brand VARCHAR(191) NOT NULL,
        last4 VARCHAR(191) NOT NULL,
        expMonth INTEGER NOT NULL,
        expYear INTEGER NOT NULL,
        isDefault BOOLEAN NOT NULL DEFAULT false,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id),
        INDEX PaymentMethod_userId_idx (userId)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);
        console.log('Table created (or already exists).');

        // Add foreign key if not exists (this is harder to check in raw SQL easily without failing, so we wrap in try/catch)
        try {
            await prisma.$executeRawUnsafe(`
            ALTER TABLE PaymentMethod 
            ADD CONSTRAINT PaymentMethod_userId_fkey 
            FOREIGN KEY (userId) REFERENCES User(id) ON DELETE RESTRICT ON UPDATE CASCADE;
        `);
            console.log('Foreign key added.');
        } catch (e) {
            console.log('Foreign key might already exist or failed:', (e as any).message);
        }

    } catch (e) {
        console.error('Failed to create table:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
