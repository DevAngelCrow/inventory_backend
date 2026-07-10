import { PrismaClient } from 'generated/prisma/client';

export const seedCtlGeographicDivisionType = async (tx: PrismaClient) => {

  console.log('Seeding ctl_geographic_division_type data ...');

  // IDs fijos de países
  const EL_SALVADOR_ID = '01c94dfc-6c83-438b-9641-9a3e4456a262';
  const USA_ID = '8a9f9123-f7cc-4964-aa80-f3c3f0af4bfe';

  // Solo un tipo por país y nivel
  const data = [
    // El Salvador
    {
      id: '00000000-0000-4000-9000-000000000001',
      id_country: EL_SALVADOR_ID,
      name: 'Departamento',
      level: 1,
      active: true,
    },
    {
      id: '00000000-0000-4000-9000-000000000002',
      id_country: EL_SALVADOR_ID,
      name: 'Municipio',
      level: 2,
      active: true,
    },
    {
      id: '00000000-0000-4000-9000-000000000003',
      id_country: EL_SALVADOR_ID,
      name: 'Distrito',
      level: 3,
      active: true,
    },
    // Estados Unidos
    {
      id: '00000000-0000-4000-9000-000000000004',
      id_country: USA_ID,
      name: 'Estado',
      level: 1,
      active: true,
    },
    {
      id: '00000000-0000-4000-9000-000000000005',
      id_country: USA_ID,
      name: 'Condado',
      level: 2,
      active: true,
    },
    {
      id: '00000000-0000-4000-9000-000000000008',
      id_country: USA_ID,
      name: 'Ciudad',
      level: 3,
      active: true,
    },
  ];

  await tx.ctl_geographic_division_type.createMany({
    data,
    skipDuplicates: true,
  });
};
