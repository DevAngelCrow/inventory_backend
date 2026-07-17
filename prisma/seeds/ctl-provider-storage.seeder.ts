import { PrismaClient } from 'generated/prisma/client';

export const seedCtlProviderStorage = async (tx: PrismaClient) => {

  console.log('Seeding ctl_gender data ...');
  await tx.ctl_provider_storage.createMany({
    data: [
      {
        id: '00000000-0000-4000-8000-000000000001',
        name: 'LOCAL',
        code: 'LOCAL',
        description: 'LOCAL',
        active: true,
      },
      {
        id: '00000000-0000-4000-8000-000000000002',
        name: 'S3',
        code: 'S3',
        description: 'Cloudflare R2',
        active: true,
      },
    ],
    skipDuplicates: true,
  });
};
