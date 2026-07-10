import { PrismaClient } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';
export const seedMntuser = async (tx: PrismaClient) => {

  console.log('Seeding mnt_user data ...');
  const people = await tx.mnt_people.findFirst({
    where: { id: "00000000-0000-4000-8000-000000000001" },
  });
  const status = await tx.ctl_status.findFirst({
    where: { code: 'AC', id: "00000000-0000-4000-8000-000000000001" },
  });
  if (!people || !status) {
    throw new Error('Please seed mnt_people and ctl_status first.');
  }
  await tx.mnt_user.createMany({
    data: [{
      id: "00000000-0000-4000-8000-000000000001",
      id_people: people.id,
      user_name: 'admin',
      password: await bcrypt.hash('$admin123', 10),
      id_status: status.id,
      last_access: new Date(),
      is_validated: true,
      email_verified_at: new Date(),
    }],
    skipDuplicates: true,
  });
};
