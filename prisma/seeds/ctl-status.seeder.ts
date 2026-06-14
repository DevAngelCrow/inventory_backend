import { PrismaClient } from 'generated/prisma/client';

export const seedCtlStatus = async (tx: PrismaClient) => {
  await tx.ctl_status.deleteMany();
  console.log('Seeding ctl_status data ...');
  await tx.ctl_status.createMany({
    data: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        code: 'AC',
        name: 'Activo',
        description: 'Estado activo',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000001",
        state_color: '#008000',
      },
      {
        id: "00000000-0000-4000-8000-000000000002",
        code: 'IN',
        name: 'Inactivo',
        description: 'Estado inactivo',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000001",
        state_color: '#FF0000',
      },
      {
        id: "00000000-0000-4000-8000-000000000003",
        code: 'PND',
        name: 'Pendiente',
        description: 'Estado pendiente',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000001",
        state_color: '#FFCA28',
      },
      {
        id: "00000000-0000-4000-8000-000000000004",
        code: 'NV',
        name: 'No Verificado',
        description: 'Estado de usuario sin verificar su cuenta de correo',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000001",
        state_color: '#E0E0E0',
      },
      {
        id: "00000000-0000-4000-8000-000000000005",
        code: 'AC',
        name: 'Activo',
        description: 'Estado activo para columnas booleanas.',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000002",
        state_color: '#008000',
      },
      {
        id: "00000000-0000-4000-8000-000000000006",
        code: 'INA',
        name: 'Inactivo',
        description: 'Estado inactivo para columnas booleanas.',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000002",
        state_color: '#FF0000',
      },
    ],
    skipDuplicates: true,
  });
};
