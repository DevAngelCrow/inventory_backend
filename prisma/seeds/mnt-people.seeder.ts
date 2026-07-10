import { PrismaClient } from 'generated/prisma/client';

export const seedMntPeople = async (tx: PrismaClient) => {

  console.log('Seeding mnt_people data ...');
  const gender = await tx.ctl_gender.findFirst({
    where: { id: "00000000-0000-4000-8000-000000000001" },
  });
  const maritalStatus = await tx.ctl_marital_status.findFirst({
    where: { id: "00000000-0000-4000-8000-000000000001" },
  });
  const status = await tx.ctl_status.findFirst({
    where: { code: 'AC', id: "00000000-0000-4000-8000-000000000001" },
  });

  if (!gender || !maritalStatus || !status) {
    throw new Error(
      'Required foreign key data not found. Please seed ctl_gender, ctl_marital_status, and ctl_status first.',
    );
  }
  await tx.mnt_people.createMany({
    data: [{
      id: "00000000-0000-4000-8000-000000000001",
      first_name: 'test',
      middle_name: 'test',
      last_name: 'test',
      birthdate: new Date('2025-01-01'),
      id_gender: gender.id,
      email: 'test@mail.com',
      id_marital_status: maritalStatus.id,
      img_path: 'test/test',
      phone: '22222222',
      id_status: status.id,
    }],
    skipDuplicates: true,
  });
};
