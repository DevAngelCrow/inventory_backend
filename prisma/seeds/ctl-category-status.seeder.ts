import { PrismaClient } from 'generated/prisma/client';

export const seedCategoryStatus = async (tx: PrismaClient) => {
  await tx.ctl_category_status.deleteMany();
  console.log('Seeding ctl_category_status data ...');
  await tx.ctl_category_status.createMany({
    data: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        name: 'Multiples',
        code: 'MT',
        description: 'Categoria para los estados multiples',
        active: true,
      },
      {
        id: "00000000-0000-4000-8000-000000000002",
        name: 'Booleanos',
        code: 'BL',
        description: 'Categoria para los estados booleanos',
        active: true,
      },
    ],
    skipDuplicates: true,
  });
};
