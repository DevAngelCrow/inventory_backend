import { PrismaClient } from 'generated/prisma/client';

export const seedCategoryStatus = async (tx: PrismaClient) => {

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
      {
        id: "00000000-0000-4000-8000-000000000003",
        name: 'Reservaciones',
        code: 'RES',
        description: 'Estados para Reservaciones',
        active: true,
      },
      {
        id: "00000000-0000-4000-8000-000000000004",
        name: 'Facturas',
        code: 'INV',
        description: 'Estados para Facturas',
        active: true,
      },
      {
        id: "00000000-0000-4000-8000-000000000005",
        name: 'Pagos',
        code: 'PAY',
        description: 'Estados para Pagos',
        active: true,
      },
      {
        id: "00000000-0000-4000-8000-000000000006",
        name: 'Inspecciones',
        code: 'INS',
        description: 'Estados para Inspecciones',
        active: true,
      },
    ],
    skipDuplicates: true,
  });
};
