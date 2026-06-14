import { PrismaClient } from 'generated/prisma/client';

export const seedMntUserRol = async (tx: PrismaClient) => {
  await tx.mnt_user_rol.deleteMany();
  console.log('Seeding mnt_user_rol data ...');
  const user = await tx.mnt_user.findFirst({
    where: { id: '00000000-0000-4000-8000-000000000001' },
  });
  const rol = await tx.mnt_role.findFirst({
    where: { id: '00000000-0000-4000-8000-000000000001' },
  });
  if (!user || !rol) {
    throw new Error('Please seed mnt_user and mnt_role first.');
  }
  await tx.mnt_user_rol.createMany({
    data: [
      {
        id_role: rol.id,
        id_user: user.id,
        created_at: new Date(),
      },
    ],
    skipDuplicates: true,
  });
};
