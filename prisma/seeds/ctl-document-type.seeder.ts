import { PrismaClient } from 'generated/prisma/client';

export const seedCtlDocumentType = async (tx: PrismaClient) => {

  console.log('Seeding ctl_document_type data ...');
  await tx.ctl_document_type.createMany({
    data: [
      {
        name: 'DUI',
        description: 'Documento Único de Identidad',
        mask: '99999999-9',
        active: true,
      },
    ],
    skipDuplicates: true,
  });
};
