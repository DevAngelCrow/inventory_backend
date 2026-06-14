import { PrismaClient } from 'generated/prisma/client';

export const seedCtlProductCategory = async (tx: PrismaClient) => {
  console.log('Seeding ctl_product_category data ...');
  await tx.ctl_product_category.createMany({
    data: [
      {
        name: 'Chairs',
        description: 'All types of chairs for events',
        icon: 'chair',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Tables',
        description: 'Folding, round, rectangular tables',
        icon: 'table',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Canopies/Tents',
        description: 'Canopy tents and pavilions for outdoor events',
        icon: 'tent',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Inflatables',
        description: 'Bounce houses and inflatable attractions',
        icon: 'inflatable',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Linens/Decor',
        description: 'Tablecloths, sashes, centerpieces, and decorations',
        icon: 'linen',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Lighting',
        description: 'String lights, uplighting, and event lighting',
        icon: 'lighting',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Sound Equipment',
        description: 'Speakers, microphones, and audio equipment',
        icon: 'speaker',
        active: true,
        created_at: new Date(),
      },
      {
        name: 'Others',
        description: 'Miscellaneous event equipment',
        icon: 'misc',
        active: true,
        created_at: new Date(),
      },
    ],
    skipDuplicates: true,
  });
};
