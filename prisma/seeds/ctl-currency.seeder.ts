import { PrismaClient } from 'generated/prisma/client';

export const seedCtlCurrency = async (tx: PrismaClient) => {
  console.log('Seeding ctl_currency data ...');
  await tx.ctl_currency.createMany({
    data: [
      {
        name: 'US Dollar',
        code: 'USD',
        symbol: '$',
        is_default: true,
        active: true,
        created_at: new Date(),
      },
    ],
    skipDuplicates: true,
  });
};
