import { PrismaClient } from 'generated/prisma/client';

export const seedMntRol = async (tx: PrismaClient) => {

  console.log('Seeding mnt_rol data ...');
  const status = await tx.ctl_status.findFirst({
    where: { id: "00000000-0000-4000-8000-000000000001", code: 'AC' },
  });
  if (!status) {
    throw new Error('Please seed ctl_status for mnt_rol first.');
  }
  await tx.mnt_role.createMany({
    data: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        name: 'administrador',
        description: 'Rol para el administrador',
        id_status: status.id,
        code: 'ADMIN',
        created_at: new Date(),
      },
      {
        id: "00000000-0000-4000-8000-000000000002",
        name: 'supervisor',
        description: 'Rol para el supervisor',
        id_status: status.id,
        code: 'SUPERVISOR',
        created_at: new Date(),
      },
      {
        id: "00000000-0000-4000-8000-000000000003",
        name: 'usuario',
        description: 'Rol para el usuario',
        code: 'USER',
        id_status: status.id,
        created_at: new Date(),
      },
      {
        id: "00000000-0000-4000-8000-000000000004",
        name: 'usuario_no_verificado',
        description: 'Rol para el usuario no verificado',
        code: 'USER_UNVERIFIED',
        id_status: status.id,
        created_at: new Date(),
      },
      {
        id: "00000000-0000-4000-8000-000000000005",
        name: 'desarrollador',
        description: 'Rol para el desarrollador con acceso a la documentación de la API',
        code: 'DEV',
        id_status: status.id,
        created_at: new Date(),
      },
      {
        id: "00000000-0000-4000-8000-000000000006",
        name: 'operador_inventario',
        description: 'Rol para el operador del sistema de inventario y reservas',
        code: 'INVENTORY_OP',
        id_status: status.id,
        created_at: new Date(),
      },
    ],
    skipDuplicates: true,
  });
};
