import { PrismaClient } from 'generated/prisma/client';

export const seedMntRoutePermissions = async (tx: PrismaClient) => {

  console.log('Seeding mnt_route_permissions data ...');

  const permissionsMap: Record<string, Record<string, string[]>> = {
    Rutas: {
      routes: ['listar-rutas'],
    },
    'Categoria de permiso': {
      'category-permissions': ['listar-categorias-permisos'],
    },
    Permisos: {
      permissions: ['listar-permisos'],
    },
    Roles: {
      role: ['listar-roles'],
    },
    'Usuarios-Roles': {
      'user-role': ['listar-usuarios-roles'],
    },
    'Verificacion de correo': {
      'verify-email': ['verificar-correo-usuario'],
      'pending-verification-email': [
        'solicitar-enlace-verificacion-correo-usuario',
      ],
    },
    'Inicio de sesion': {
      login: ['inicio-sesion'],
    },
    Registro: {
      'sign-up': ['registro-usuario'],
    },
    Layout: {
      layout: ['ver-layout'],
    },
    Test: {
      'test-view': ['ver-test-components'],
    },
    Dashboard: {
      dashboard: ['ver-tablero'],
    },
    'Menu usuario': {
      Usuario: ['ver-menu-usuario'],
    },
    'Estados globales': {
      'global-status': ['listar-estados-globales'],
    },
    Pais: {
      countries: ['listar-paises'],
    },
    'Tipo Division Geografica': {
      'geographic-division-types': ['listar-tipos-division-geografica'],
    },
    'Division Geografica': {
      'geographic-divisions': ['listar-divisiones-geograficas'],
    },
    Catalogos: {
      catalogs: ['listar-catalogos'],
    },
    Administracion: {
      admin: ['listar-administracion'],
    },
    'Categoría de Estados': {
      'category-status': ['listar-categorias-estados'],
    },
    'Tipo de documento': {
      'document-types': ['listar-tipos-documentos'],
    },
    Géneros: {
      genders: ['listar-generos'],
    },
    Usuario: {
      'cerrar-sesion': ['cerrar-sesion'],
      'mi-perfil': ['ver-mi-perfil'],
    },
    'Categorías de Producto': {
      'inventory-parent': ['listar-categorias-producto'],
      'product-categories': ['listar-categorias-producto'],
    },
    'Productos': {
      'inventory-parent': ['listar-productos'],
      'products': ['listar-productos'],
    },
    'Unidades de Medida': {
      'inventory-parent': ['listar-unidades-medida'],
      'measurement-units': ['listar-unidades-medida'],
    },
    'Mantenimiento de Productos': {
      'inventory-parent': ['listar-mantenimientos-producto'],
      'product-maintenance': ['listar-mantenimientos-producto', 'editar-mantenimiento-producto', 'ver-mantenimiento-producto'],
    },
    'Clientes': {
      'customers-parent': ['listar-clientes'],
      'customers-list': ['listar-clientes'],
    },
    'Reservas': {
      'reservations-parent': ['listar-reservas', 'ver-calendario-reservas'],
      'reservations-list': ['listar-reservas', 'eliminar-reserva'],
      'reservations-calendar': ['ver-calendario-reservas'],
    },
    'Pagos': {
      'billing-parent': ['listar-pagos'],
      'billing-payments': ['listar-pagos', 'procesar-pago'],
    },
    'Facturación': {
      'billing-parent': ['listar-facturas'],
      'billing-invoices': ['listar-facturas'],
    },
  };
  for (const [categoryName, routes] of Object.entries(permissionsMap)) {
    const category = await tx.ctl_category_permissions.findFirst({
      where: { name: categoryName },
    });
    if (!category) {
      console.warn(
        `[!] Advertencia: La categoría de permisos '${categoryName}' no fue encontrada en la BD. Saltando...`,
      );
      continue;
    }
    for (const [routeName, permissionsNames] of Object.entries(routes)) {
      const route = await tx.mnt_route.findFirst({
        where: { name: routeName },
      });
      if (!route) {
        continue;
      }
      if (permissionsNames.length === 0) {
        continue;
      }
      const permissions = await tx.ctl_permissions.findMany({
        where: {
          id_category_permissions: category.id,
          name: { in: permissionsNames },
        },
      });
      if (permissions.length === 0) {
        continue;
      }
      const dataToInsert = permissions.map((permission) => ({
        id_route: route.id,
        id_permission: permission.id,
        created_at: new Date(),
      }));
      await tx.mnt_route_permissions.createMany({
        data: dataToInsert,
        skipDuplicates: true,
      });
      console.log(
        `> Ruta '${routeName}': ${dataToInsert.length} permisos asignados correctamente.`,
      );
    }
  }
  console.log('> Seed de mnt_route_permissions completado.');
};
