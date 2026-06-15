const { PrismaClient } = require('./generated/prisma/index.js');
const prisma = new PrismaClient();
async function main() {
  try {
    const customers = await prisma.mnt_customer.findMany({ take: 1 });
    console.log('Customers:', customers);
    const invoices = await prisma.mnt_invoice.findMany({ take: 1 });
    console.log('Invoices:', invoices);
  } catch (e) {
    console.error('Prisma Error:', e.message);
  }
}
main().finally(() => prisma.$disconnect());
