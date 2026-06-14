import { PrismaClient } from 'generated/prisma/client';

export const seedCtlGender = async (tx: PrismaClient) => {
  await tx.ctl_gender.deleteMany();
  console.log('Seeding ctl_gender data ...');
  await tx.ctl_gender.createMany({
    data: [{
      id: "00000000-0000-4000-8000-000000000001", name: 'Masculino' }, { name: 'Femenino' }, { name: 'Otro' }],
    skipDuplicates: true,
  });
};
