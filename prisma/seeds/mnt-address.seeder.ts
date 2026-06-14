import { PrismaClient } from 'generated/prisma/client';

export const seedMntAddress = async (tx: PrismaClient) => {
  await tx.mnt_address.deleteMany();
  console.log('Seeding mnt_address data ...');
  const people = await tx.mnt_people.findFirst({
    where: { id: "00000000-0000-4000-8000-000000000001" },
  });
  if (!people) {
    throw new Error('Please seed mnt_people first.');
  }
  await tx.mnt_address.createMany({
    data: [{
      id_people: people.id,
      street: 'Calle test',
      street_number: '125',
      neighborhood: 'Residencial test',
      id_geographic_division: null,
      house_number: '78',
      block: 'J',
      pathway: 'pasaje test',
      current: true,
      active: true,
    }],
    skipDuplicates: true,
  });
};
