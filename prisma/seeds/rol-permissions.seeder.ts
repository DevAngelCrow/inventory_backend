import { PrismaClient } from 'generated/prisma/client';

export const seedRolPermissions = async (tx: PrismaClient) => {
  await tx.rol_permissions.deleteMany();
  console.log('Seeding rol_permissions data ...');

  // Obtener todos los roles
  const roles = await tx.mnt_role.findMany({
    orderBy: { id: 'asc' },
  });

  if (roles.length === 0) {
    throw new Error('Please seed mnt_role first.');
  }

  // Mapa de permisos por rol según matriz
  const permissionsByRole = {
    desarrollador: [
      // Hereda todos los permisos de supervisor
      // Seguridad - Rutas
      'listar-rutas',
      'ver-ruta',
      // Autenticación - Verificacion de correo
      'verificar-correo-usuario',
      'solicitar-enlace-verificacion-correo-usuario',
      // Autenticación - Inicio de sesión
      'inicio-sesion',
      // Autenticación - Registro
      'registro-usuario',
      // Autenticación - Usuario
      'crear-usuario',
      'ver-usuario-correo',
      'cerrar-sesion',
      'ver-nombre-usuario-menu',
      'ver-mi-perfil',
      'editar-mi-perfil',
      'ver-usuario-nombre',
      // Catálogos - País
      'crear-pais',
      'listar-paises',
      'editar-pais',
      'ver-pais',
      'eliminar-pais',
      // Catálogos - Tipo Division Geografica
      'crear-tipo-division-geografica',
      'listar-tipos-division-geografica',
      'editar-tipo-division-geografica',
      'ver-tipo-division-geografica',
      'eliminar-tipo-division-geografica',
      // Catálogos - Division Geografica
      'crear-division-geografica',
      'listar-divisiones-geograficas',
      'editar-division-geografica',
      'ver-division-geografica',
      'eliminar-division-geografica',
      // Perfil - Documento
      'crear-documento',
      'listar-documentos',
      'editar-documento',
      'ver-documento',
      'eliminar-documento',
      // IDOR bypass — usuarios admin pueden gestionar documentos de cualquier persona
      'gestionar-cualquier-documento',
      // Perfil - Tipo de documento
      'crear-tipo-documento',
      'listar-tipos-documentos',
      'editar-tipo-documento',
      'ver-tipo-documento',
      'eliminar-tipo-documento',
      // Perfil - Dirección
      'crear-dirección',
      'listar-direcciones',
      'editar-dirección',
      'ver-dirección',
      'eliminar-dirección',
      // IDOR bypass — usuarios admin pueden gestionar direcciones de cualquier persona
      'gestionar-cualquier-dirección',
      // Perfil - Persona
      'crear-persona',
      'editar-persona',
      'ver-persona',
      'ver-persona-email',
      // General
      'ver-layout',
      'ver-tablero',
      'ver-menu-usuario',
      // Documentación API
      'ver-documentacion-api',
    ],
    administrador: [
      // Seguridad - Rutas
      'listar-rutas',
      'crear-ruta',
      'editar-ruta',
      'ver-ruta',
      'eliminar-ruta',
      // Seguridad - Categoria de permiso
      'crear-categoria-permiso',
      'listar-categorias-permisos',
      'editar-categoria-permisos',
      'ver-categoria-permiso',
      'eliminar-categoria-permiso',
      // Seguridad - Permisos
      'crear-permiso',
      'listar-permisos',
      'editar-permiso',
      'ver-permiso',
      'eliminar-permiso',
      // Seguridad - Roles
      'crear-rol',
      'listar-roles',
      'editar-rol',
      'ver-rol',
      'eliminar-rol',
      // Seguridad - Usuarios-Roles
      'crear-usuario-rol',
      'editar-usuario-rol',
      'listar-usuarios-roles',
      'ver-usuario-roles',
      // Autenticación - Verificacion de correo
      'verificar-correo-usuario',
      'solicitar-enlace-verificacion-correo-usuario',
      // Autenticación - Inicio de sesión
      'inicio-sesion',
      // Autenticación - Registro
      'registro-usuario',
      // Autenticación - Usuario
      'crear-usuario',
      'ver-usuario-correo',
      'cerrar-sesion',
      'ver-nombre-usuario-menu',
      'ver-mi-perfil',
      'ver-perfil-usuario',
      'editar-mi-perfil',
      'ver-usuario-nombre',
      'listar-usuarios',
      // Catálogos - Estados globales
      'crear-estado-global',
      'listar-estados-globales',
      'editar-estado-global',
      'ver-estado-global',
      'eliminar-estado-global',
      // Catálogos - Estado civil
      'crear-estado-civil',
      'listar-estados-civiles',
      'editar-estado-civil',
      'ver-estado-civil',
      'eliminar-estado-civil',
      // Catálogos - País
      'crear-pais',
      'listar-paises',
      'editar-pais',
      'ver-pais',
      'eliminar-pais',
      // Catálogos - Tipo Division Geografica
      'crear-tipo-division-geografica',
      'listar-tipos-division-geografica',
      'editar-tipo-division-geografica',
      'ver-tipo-division-geografica',
      'eliminar-tipo-division-geografica',
      // Catálogos - Division Geografica
      'crear-division-geografica',
      'listar-divisiones-geograficas',
      'editar-division-geografica',
      'ver-division-geografica',
      'eliminar-division-geografica',
      // Perfil - Documento
      'crear-documento',
      'listar-documentos',
      'editar-documento',
      'ver-documento',
      'eliminar-documento',
      // IDOR bypass — usuarios admin pueden gestionar documentos de cualquier persona
      'gestionar-cualquier-documento',
      // Perfil - Tipo de documento
      'crear-tipo-documento',
      'listar-tipos-documentos',
      'editar-tipo-documento',
      'ver-tipo-documento',
      'eliminar-tipo-documento',
      // Perfil - Dirección
      'crear-dirección',
      'listar-direcciones',
      'editar-dirección',
      'ver-dirección',
      'eliminar-dirección',
      // IDOR bypass — usuarios admin pueden gestionar direcciones de cualquier persona
      'gestionar-cualquier-dirección',
      // Perfil - Persona
      'crear-persona',
      'listar-personas',
      'editar-persona',
      'ver-persona',
      'eliminar-persona',
      'ver-persona-email',
      // Almacenamiento - Proveedor de almacenamiento
      'crear-proveedor-almacenamiento',
      'listar-proveedores-almacenamiento',
      'editar-proveedor-almacenamiento',
      'ver-proveedor-almacenamiento',
      'eliminar-proveedor-almacenamiento',
      // Almacenamiento - Destino de almacenamiento
      'subir-multimedia-almacenamiento',
      'listar-archivos-almacenamiento',
      // General
      'ver-layout',
      'ver-test-components',
      'ver-tablero',
      'ver-menu-usuario',
      'listar-catalogos',
      'listar-administracion',
      // Categorías de Estados
      'crear-categoria-estado',
      'listar-categorias-estados',
      'editar-categoria-estado',
      'ver-categoria-estado',
      'eliminar-categoria-estado',
      // Géneros
      'listar-generos',
      // Documentación API
      'ver-documentacion-api',
      // Auditoría
      'listar-audit-logs',
    ],
    supervisor: [
      // Seguridad - Rutas
      'listar-rutas',
      'ver-ruta',
      // Autenticación - Verificacion de correo
      'verificar-correo-usuario',
      'solicitar-enlace-verificacion-correo-usuario',
      // Autenticación - Inicio de sesión
      'inicio-sesion',
      // Autenticación - Registro
      'registro-usuario',
      // Autenticación - Usuario
      'crear-usuario',
      'ver-usuario-correo',
      'cerrar-sesion',
      'ver-nombre-usuario-menu',
      'ver-mi-perfil',
      'editar-mi-perfil',
      'ver-usuario-nombre',
      // Catálogos - País
      'crear-pais',
      'listar-paises',
      'editar-pais',
      'ver-pais',
      'eliminar-pais',
      // Catálogos - Tipo Division Geografica
      'crear-tipo-division-geografica',
      'listar-tipos-division-geografica',
      'editar-tipo-division-geografica',
      'ver-tipo-division-geografica',
      'eliminar-tipo-division-geografica',
      // Catálogos - Division Geografica
      'crear-division-geografica',
      'listar-divisiones-geograficas',
      'editar-division-geografica',
      'ver-division-geografica',
      'eliminar-division-geografica',
      // Perfil - Documento
      'crear-documento',
      'listar-documentos',
      'editar-documento',
      'ver-documento',
      'eliminar-documento',
      // IDOR bypass — usuarios admin pueden gestionar documentos de cualquier persona
      'gestionar-cualquier-documento',
      // Perfil - Tipo de documento
      'crear-tipo-documento',
      'listar-tipos-documentos',
      'editar-tipo-documento',
      'ver-tipo-documento',
      'eliminar-tipo-documento',
      // Perfil - Dirección
      'crear-dirección',
      'listar-direcciones',
      'editar-dirección',
      'ver-dirección',
      'eliminar-dirección',
      // IDOR bypass — usuarios admin pueden gestionar direcciones de cualquier persona
      'gestionar-cualquier-dirección',
      // Perfil - Persona
      'crear-persona',
      'editar-persona',
      'ver-persona',
      'ver-persona-email',
      // General
      'ver-layout',
      'ver-tablero',
      'ver-menu-usuario',
    ],
    usuario: [
      // Autenticación - Verificacion de correo
      'verificar-correo-usuario',
      'solicitar-enlace-verificacion-correo-usuario',
      // Autenticación - Inicio de sesión
      'inicio-sesion',
      // Autenticación - Registro
      'registro-usuario',
      // Autenticación - Usuario
      'crear-usuario',
      'ver-usuario-correo',
      'cerrar-sesion',
      'ver-nombre-usuario-menu',
      'ver-mi-perfil',
      'editar-mi-perfil',
      'ver-usuario-nombre',
      // Perfil - Documento
      'crear-documento',
      'listar-documentos',
      'editar-documento',
      'ver-documento',
      'eliminar-documento',
      // Perfil - Dirección
      'crear-dirección',
      'listar-direcciones',
      'editar-dirección',
      'ver-dirección',
      'eliminar-dirección',
      // Perfil - Persona
      'crear-persona',
      'editar-persona',
      'ver-persona',
      'ver-persona-email',
      // General
      'ver-layout',
      'ver-tablero',
      'ver-menu-usuario',
      // Catálogos - Tipo Division Geografica
      'listar-tipos-division-geografica',
      // Catálogos - Division Geografica
      'listar-divisiones-geograficas',
    ],
    usuario_no_verificado: [
      // Autenticación - Usuario
      'cerrar-sesion',
      'ver-mi-perfil',
      'editar-mi-perfil',
      // Perfil - Persona
      'editar-persona',
      // General
      'ver-layout',
      'ver-menu-usuario',
    ],
  };

  // Asignar permisos a cada rol
  for (const role of roles) {
    const permissionNames =
      permissionsByRole[role.name as keyof typeof permissionsByRole];

    if (!permissionNames) {
      console.log(`No hay permisos definidos para el rol: ${role.name}`);
      continue;
    }

    console.log(
      `Asignando ${permissionNames.length} permisos al rol: ${role.name}`,
    );

    for (const permissionName of permissionNames) {
      const permission = await tx.ctl_permissions.findFirst({
        where: { name: permissionName },
      });

      if (permission) {
        await tx.rol_permissions.createMany({
          data: [
            {
              id_role: role.id,
              id_permission: permission.id,
              created_at: new Date(),
            },
          ],
          skipDuplicates: true,
        });
      } else {
        console.warn(
          `Permiso no encontrado: ${permissionName} para rol ${role.name}`,
        );
      }
    }
  }

  console.log('✅ Rol permissions seeded successfully');
};
