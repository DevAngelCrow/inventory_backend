import { PrismaClient } from 'generated/prisma/client';

export const seedCtlMaritalStatus = async (tx: PrismaClient) => {

  console.log('Seeding ctl_marital_status data ...');
  await tx.ctl_marital_status.createMany({
    data: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        name: 'Soltero',
        description: 'Estado civil soltero',
      },
      { name: 'Casado', description: 'Estado civil casado' },
      {
        name: 'Divorciado',
        description: 'Estado civil divorciado',
      },
    ],
    skipDuplicates: true,
  });
};
