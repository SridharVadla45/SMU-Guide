import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- DB DIAGNOSTIC START ---');

    // Check env var (we can access process.env even if we can't read the file)
    const url = process.env.DATABASE_URL || 'NOT_SET';
    console.log('DATABASE_URL:', url.replace(/:[^:@]*@/, ':****@')); // Mask password

    try {
        await prisma.$connect();
        console.log('Successfully connected to database.');

        // List tables
        const tables: any[] = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = DATABASE()
    `;

        console.log('Tables in database:', tables.map(t => t.TABLE_NAME || t.table_name).join(', '));

        const hasPaymentMethod = tables.some(t => (t.TABLE_NAME || t.table_name).toLowerCase() === 'paymentmethod');
        console.log('Has PaymentMethod table:', hasPaymentMethod);

        if (hasPaymentMethod) {
            // Check columns
            const columns: any[] = await prisma.$queryRaw`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_schema = DATABASE() AND table_name = 'PaymentMethod'
        `;
            console.log('Columns in PaymentMethod:', columns.map(c => c.COLUMN_NAME || c.column_name).join(', '));
        }

    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await prisma.$disconnect();
        console.log('--- DB DIAGNOSTIC END ---');
    }
}

main();
