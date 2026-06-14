import { PrismaClient } from 'generated/prisma/client';

export const seedCtlProductCondition = async (tx: PrismaClient) => {
  console.log('Seeding ctl_product_condition data ...');
  await tx.ctl_product_condition.createMany({
    data: [
      {
        name: 'New',
        description: 'Brand new, never used',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Good',
        description: 'Used but in excellent condition',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Fair',
        description: 'Used with minor wear and tear',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Damaged',
        description: 'Has visible damage that affects use',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Under Repair',
        description: 'Currently being repaired, not available for rental',
        active: true,
        created_at: new Date(),
      },
    ],
    skipDuplicates: true,
  });
};
