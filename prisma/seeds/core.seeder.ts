/**
 * CORE SEEDER
 * -----------
 * Seeds only the data required to bootstrap the base RBAC system:
 * statuses, permissions, roles, routes, and the initial admin user.
 *
 * Domain-specific data (countries, geographic divisions, genders,
 * marital statuses, document types, addresses, sample people) lives
 * in main.seeder.ts and is intentionally omitted here so this seeder
 * can be reused in any project derived from this template.
 *
 * Usage:  npm run seed:core
 */

import { seedCategoryStatus } from './ctl-category-status.seeder';
import { seedCtlStatus } from './ctl-status.seeder';
import { seedCtlCategoryPermissions } from './ctl-category-permissions.seeder';
import { seedCtlPermissions } from './ctl-permissions.seeder';
import { seedCtlProviderStorage } from './ctl-provider-storage.seeder';
import { seedMntPeople } from './mnt-people.seeder';
import { seedMntuser } from './mnt-user.seeder';
import { seedMntRol } from './mnt-rol.seeder';
import { seedRolPermissions } from './rol-permissions.seeder';
import { seedMntUserRol } from './mnt-user-rol.seeder';
import { seedMntRoute } from './mnt-route.seeder';
import { seedMntRoutePermissions } from './mnt-route-permissions.seeder';
import { PrismaClient } from 'generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

let connectionString = '';
if (process.env.NODE_ENV === 'production') {
  connectionString = process.env.DATABASE_DIRECT_URL!;
} else {
  connectionString = `${process.env.DB_PROVIDER}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?schema=public`;
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/** Tables to truncate — in reverse dependency order (core tables only) */
const CORE_TABLES = [
  'mnt_route_permissions',
  'mnt_route',
  'mnt_user_rol',
  'rol_permissions',
  'mnt_role',
  'ctl_permissions',
  'ctl_category_permissions',
  'mnt_session_refresh_token',
  'mnt_storage_files',
  'ctl_provider_storage',
  'mnt_email_verification_tokens',
  'mnt_user',
  'mnt_people',
  'ctl_status',
  'ctl_category_status',
];

const coreSeeder = async () => {
  console.log('Starting core seeder...');

  console.log('Truncating core tables...');
  for (const table of CORE_TABLES) {
    try {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`,
      );
    } catch {
      console.log(`Failed to truncate ${table}, skipping...`);
    }
  }

  try {
    console.log('Seeding category statuses...'); await seedCategoryStatus(prisma);
    console.log('Seeding statuses...');          await seedCtlStatus(prisma);
    console.log('Seeding provider storage...');  await seedCtlProviderStorage(prisma);
    console.log('Seeding people (admin)...');    await seedMntPeople(prisma);
    console.log('Seeding users (admin)...');     await seedMntuser(prisma);
    console.log('Seeding category permissions...'); await seedCtlCategoryPermissions(prisma);
    console.log('Seeding permissions...');       await seedCtlPermissions(prisma);
    console.log('Seeding roles...');             await seedMntRol(prisma);
    console.log('Seeding role permissions...');  await seedRolPermissions(prisma);
    console.log('Seeding user roles...');        await seedMntUserRol(prisma);
    console.log('Seeding routes...');            await seedMntRoute(prisma);
    console.log('Seeding route permissions...'); await seedMntRoutePermissions(prisma);
    console.log('Core seeder completed successfully.');
  } catch (error) {
    console.error('Error during core seeder execution:', error);
    throw error;
  }
};

coreSeeder()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
