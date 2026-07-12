import { createHash } from 'crypto';
import { PrismaClient } from 'generated/prisma/client';
import { ADMIN1, ADMIN2, ADMIN3, ADMIN4 } from './geographic-arrays';

function generateDeterministicUUID(code: string): string {
  const hash = createHash('md5').update(`geo-${code}`).digest('hex');
  return `${hash.substring(0, 8)}-${hash.substring(8, 12)}-3${hash.substring(13, 16)}-a${hash.substring(17, 20)}-${hash.substring(20, 32)}`;
}

export const seedCtlGeographicDivision = async (tx: PrismaClient) => {
  console.log('Seeding ctl_geographic_division...');

  const dataAdmin1: any[] = [];
  const dataAdmin2: any[] = [];
  const dataAdmin3: any[] = [];

  // ===============================
  // countries map
  // ===============================
  // Lista de países permitidos (UUIDs y sus ISO2)
  const allowedCountries = [
    { uuid: '01c94dfc-6c83-438b-9641-9a3e4456a262', iso2: 'SV' }, // El Salvador
    { uuid: '8a9f9123-f7cc-4964-aa80-f3c3f0af4bfe', iso2: 'US' }, // Estados Unidos
  ];

  // Solo traer los países permitidos
  const countries = await tx.ctl_country.findMany({
    where: {
      id: { in: allowedCountries.map((c) => c.uuid) },
    },
  });

  // Mapear iso2 a uuid solo para los permitidos
  const countryMap = new Map(countries.map((c) => [c.iso2, c.id]));

  // ===============================
  // types map
  // ===============================

  const types = await tx.ctl_geographic_division_type.findMany();

  // Crear un mapa de tipos por país y nivel
  // typeByCountryLevel: { [iso2]: { [level]: id_type } }
  const typeByCountryLevel: Record<string, Record<number, string>> = {};
  for (const t of types) {
    if (!typeByCountryLevel[t.id_country])
      typeByCountryLevel[t.id_country] = {};
    typeByCountryLevel[t.id_country][t.level] = t.id;
  }

  // ===============================
  // ADMIN 1
  // ===============================

  for (const row of ADMIN1) {
    if (!countryMap.has(row.country)) continue;
    const id_country = countryMap.get(row.country);
    let id_type: string | null = null;

    if (
      id_country &&
      typeByCountryLevel[id_country] &&
      typeByCountryLevel[id_country][1]
    ) {
      id_type = typeByCountryLevel[id_country][1];
    }
    if (!id_type) continue;

    const code = `${row.country}.${row.a1}`;
    const id = generateDeterministicUUID(code);

    dataAdmin1.push({
      id,
      name: row.name,
      description: null,
      id_parent: null,
      id_country,
      id_type,
      active: true,
    });
  }

  // ===============================
  // ADMIN 2
  // ===============================

  for (const row of ADMIN2) {
    if (!countryMap.has(row.country)) continue;
    const id_country = countryMap.get(row.country);
    let id_type: string | null = null;
    if (row.country === 'SV') {
      const found = types.find(
        (t) =>
          t.id_country === id_country &&
          t.level === 2 &&
          t.name === 'Municipio',
      );
      id_type = found ? found.id : null;
    } else if (row.country === 'US') {
      if (row.a1 === 'LA') {
        const found = types.find(
          (t) =>
            t.id_country === id_country &&
            t.level === 2 &&
            t.name === 'Parroquia',
        );
        id_type = found ? found.id : null;
      } else if (row.a1 === 'AK') {
        const found = types.find(
          (t) =>
            t.id_country === id_country &&
            t.level === 2 &&
            t.name === 'Borough',
        );
        id_type = found ? found.id : null;
      } else {
        const found = types.find(
          (t) =>
            t.id_country === id_country &&
            t.level === 2 &&
            t.name === 'Condado',
        );
        id_type = found ? found.id : null;
      }
    }
    if (!id_type) continue;

    const parentCode = `${row.country}.${row.a1}`;
    const parent = generateDeterministicUUID(parentCode);
    const code = `${row.country}.${row.a1}.${row.a2}`;
    const id = generateDeterministicUUID(code);

    dataAdmin2.push({
      id,
      name: row.name,
      description: null,
      id_parent: parent,
      id_country,
      id_type,
      active: true,
    });
  }

  // ===============================
  // ADMIN 3
  // ===============================

  for (const row of ADMIN3) {
    if (!countryMap.has(row.country)) continue;
    const id_country = countryMap.get(row.country);
    let id_type: string | null = null;
    if (row.country === 'SV') {
      const found = types.find(
        (t) =>
          t.id_country === id_country && t.level === 3 && t.name === 'Distrito',
      );
      id_type = found ? found.id : null;
    } else if (row.country === 'US') {
      const found = types.find(
        (t) =>
          t.id_country === id_country &&
          t.level === 3 &&
          (t.name === 'Ciudad' || t.name === 'Pueblo' || t.name === 'Villa'),
      );
      id_type = found ? found.id : null;
    }
    if (!id_type) continue;

    const parentCode = `${row.country}.${row.a1}.${row.a2}`;
    const parent = generateDeterministicUUID(parentCode);
    const code = `${row.country}.${row.a1}.${row.a2}.${row.a3}`;
    const id = generateDeterministicUUID(code);

    dataAdmin3.push({
      id,
      name: row.name,
      description: null,
      id_parent: parent,
      id_country,
      id_type,
      active: true,
    });
  }

  // ===============================
  // ADMIN 4
  // ===============================

  for (const row of ADMIN4) {
    if (!countryMap.has(row.country)) continue;
    // No hay tipos definidos para level 4 en los datos actuales, omitir
    continue;
  }

  // Insertar por niveles de forma secuencial para respetar la FK auto-referencial:
  // Los hijos (ADMIN2, ADMIN3) necesitan que sus padres ya existan en la tabla.
  await tx.ctl_geographic_division.createMany({
    data: dataAdmin1,
    skipDuplicates: true,
  });
  console.log('ctl_geographic_division ADMIN1 seeded:', dataAdmin1.length);

  await tx.ctl_geographic_division.createMany({
    data: dataAdmin2,
    skipDuplicates: true,
  });
  console.log('ctl_geographic_division ADMIN2 seeded:', dataAdmin2.length);

  await tx.ctl_geographic_division.createMany({
    data: dataAdmin3,
    skipDuplicates: true,
  });
  console.log(
    'ctl_geographic_division ADMIN3 seeded:',
    dataAdmin3.length,
  );

  console.log(
    'ctl_geographic_division total seeded:',
    dataAdmin1.length + dataAdmin2.length + dataAdmin3.length,
  );
};
