const { PrismaClient } = require('../generated/prisma/index.js');
const prisma = new PrismaClient();
async function main() {
  try {
    const skip = 0;
    const take = 10;
    const where = { deleted_at: null, active: true };
    const [productsDb, total] = await Promise.all([
      prisma.mnt_product.findMany({
        skip,
        take,
        where,
        orderBy: { name: 'asc' }
      }),
      prisma.mnt_product.count({ where })
    ]);
    console.log('Success:', total);
  } catch(e) {
    console.error('Prisma Error:', e);
  }
}
main().finally(() => prisma.$disconnect());
