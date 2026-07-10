import { seedCtlStatus } from './ctl-status.seeder';
import { seedCtlCountry } from './ctl-country.seeder';
import { seedCtlGeographicDivisionType } from './ctl-geographic-division-type.seeder';
import { seedCtlGeographicDivision } from './ctl-geographic-division.seeder';
import { seedCtlMaritalStatus } from './ctl-marital-status.seeder';
import { seedCtlGender } from './ctl-gender.seeder';
import { seedCtlDocumentType } from './ctl-document-type.seeder';
import { seedMntPeople } from './mnt-people.seeder';
import { seedCtlProviderStorage } from './ctl-provider-storage.seeder';
import { seedMntuser } from './mnt-user.seeder';
import { seedCtlCategoryPermissions } from './ctl-category-permissions.seeder';
import { seedCtlPermissions } from './ctl-permissions.seeder';
import { seedMntRol } from './mnt-rol.seeder';
import { seedRolPermissions } from './rol-permissions.seeder';
import { seedMntUserRol } from './mnt-user-rol.seeder';
import { seedMntRoute } from './mnt-route.seeder';
import { seedMntRoutePermissions } from './mnt-route-permissions.seeder';
import { seedMntAddress } from './mnt-address.seeder';
import { seedCtlProductCategory } from './ctl-product-category.seeder';
import { seedCtlProductCondition } from './ctl-product-condition.seeder';
import { seedCtlCurrency } from './ctl-currency.seeder';
import { seedCtlPaymentMethod } from './ctl-payment-method.seeder';
import { PrismaClient } from 'generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { seedCategoryStatus } from './ctl-category-status.seeder';

const dbUserRaw = process.env.DB_USER || process.env.POSTGRES_USER || 'postgres';
const dbPasswordRaw = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || '';
const dbName = process.env.DB_NAME || process.env.POSTGRES_DB || 'postgres';
const dbHost = process.env.DATABASE_HOST || process.env.DB_HOST || 'postgres';
const dbPort = process.env.DB_PORT || '5432';
const dbProvider = process.env.DB_PROVIDER || 'postgresql';

const dbUser = encodeURIComponent(dbUserRaw);
const dbPassword = encodeURIComponent(dbPasswordRaw);
const connectionString = `${dbProvider}://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?schema=public`;

process.env.DATABASE_URL = connectionString;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const mainSeeder = async () => {
  console.log('Starting main seeder...');

  console.log('Database connected.');
  try {
    // Se eliminó la instrucción de TRUNCATE TABLE para evitar la pérdida de datos
    // al ejecutar los seeders múltiples veces en cada despliegue.

    console.log('Seeding categories...');
    await seedCategoryStatus(prisma);
    console.log('Seeding statuses...');
    await seedCtlStatus(prisma);
    console.log('Seeding countries...');
    await seedCtlCountry(prisma);
    console.log('Seeding geographic division types...');
    await seedCtlGeographicDivisionType(prisma);
    console.log('Seeding geographic divisions...');
    await seedCtlGeographicDivision(prisma);
    console.log('Seeding marital statuses...');
    await seedCtlMaritalStatus(prisma);
    console.log('Seeding genders...');
    await seedCtlGender(prisma);
    console.log('Seeding document types...');
    await seedCtlDocumentType(prisma);
    console.log('Seeding people...');
    await seedMntPeople(prisma);
    console.log('Seeding provider storage...');
    await seedCtlProviderStorage(prisma);
    console.log('Seeding users...');
    await seedMntuser(prisma);
    console.log('Seeding category permissions...');
    await seedCtlCategoryPermissions(prisma);
    console.log('Seeding permissions...');
    await seedCtlPermissions(prisma);
    console.log('Seeding roles...');
    await seedMntRol(prisma);
    console.log('Seeding role permissions...');
    await seedRolPermissions(prisma);
    console.log('Seeding user roles...');
    await seedMntUserRol(prisma);
    console.log('Seeding routes...');
    await seedMntRoute(prisma);
    console.log('Seeding route permissions...');
    await seedMntRoutePermissions(prisma);
    console.log('Seeding addresses...');
    await seedMntAddress(prisma);
    console.log('Seeding product categories...');
    await seedCtlProductCategory(prisma);
    console.log('Seeding product conditions...');
    await seedCtlProductCondition(prisma);
    console.log('Seeding currencies...');
    await seedCtlCurrency(prisma);
    console.log('Seeding payment methods...');
    await seedCtlPaymentMethod(prisma);
    console.log('Main seeder completed successfully.');
  } catch (error) {
    console.error('Error during main seeder execution:', error);
    throw error;
  }
};
mainSeeder()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
