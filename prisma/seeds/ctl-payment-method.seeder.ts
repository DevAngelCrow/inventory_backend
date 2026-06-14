import { PrismaClient } from 'generated/prisma/client';

export const seedCtlPaymentMethod = async (tx: PrismaClient) => {
  console.log('Seeding ctl_payment_method data ...');
  await tx.ctl_payment_method.createMany({
    data: [
      {
        name: 'Cash',
        code: 'CASH',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Credit Card',
        code: 'CREDIT_CARD',
        active: false,
        created_at: new Date(),
      },
      {
        name: 'Zelle',
        code: 'ZELLE',
        active: false,
        created_at: new Date(),
      },
      {
        name: 'Check',
        code: 'CHECK',
        active: false,
        created_at: new Date(),
      },
      {
        name: 'Venmo',
        code: 'VENMO',
        active: false,
        created_at: new Date(),
      },
    ],
    skipDuplicates: true,
  });
};
