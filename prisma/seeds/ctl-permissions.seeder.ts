import { PrismaClient } from 'generated/prisma/client';

export const seedCtlPermissions = async (tx: PrismaClient) => {
  await tx.ctl_permissions.deleteMany();
  console.log('Seeding ctl_permissions data ...');
  const categories = await tx.ctl_category_permissions.findMany({
    orderBy: { id: 'asc' },
  });
  await tx.ctl_permissions.createMany({
    data: [
      // PERMISOS DE RUTAS
      {
        name: 'listar-rutas',
        description: 'Lista las rutas para navegar en el sistema',
        id_category_permissions: categories[0].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'crear-ruta',
        description: 'Crea la ruta del sistema',
        id_category_permissions: categories[0].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-ruta',
        description: 'Edita la ruta del sistema',
        id_category_permissions: categories[0].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-ruta',
        description: 'Visualiza la ruta del sistema',
        id_category_permissions: categories[0].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-ruta',
        description: 'Elimina ruta del sistema',
        id_category_permissions: categories[0].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE CATEGORIAS DE PERMISOS
      {
        name: 'crear-categoria-permiso',
        description: 'Crea categoria de permiso',
        id_category_permissions: categories[1].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-categorias-permisos',
        description: 'Lista las categorias de permisos',
        id_category_permissions: categories[1].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-categoria-permisos',
        description: 'Edita la categoria del permiso',
        id_category_permissions: categories[1].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-categoria-permiso',
        description: 'Ve registro de categoria de permiso',
        id_category_permissions: categories[1].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-categoria-permiso',
        description: 'Elimina categoria de permiso',
        id_category_permissions: categories[1].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS
      {
        name: 'crear-permiso',
        description: 'Crea permiso',
        id_category_permissions: categories[2].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-permisos',
        description: 'Lista los permisos del sistema',
        id_category_permissions: categories[2].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-permiso',
        description: 'Edita el permiso',
        id_category_permissions: categories[2].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-permiso',
        description: 'Ver el registro del permiso',
        id_category_permissions: categories[2].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-permiso',
        description: 'Elimina permiso del sistema',
        id_category_permissions: categories[2].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'crear-rol',
        description: 'Crea un rol',
        id_category_permissions: categories[3].id,
        created_at: new Date(),
        active: true,
      },
      // Permisos de Roles
      {
        name: 'listar-roles',
        description: 'Lista los roles',
        id_category_permissions: categories[3].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-rol',
        description: 'Edita el rol',
        id_category_permissions: categories[3].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-rol',
        description: 'Ver el registro del rol',
        id_category_permissions: categories[3].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-rol',
        description: 'Elimina el rol del sistema',
        id_category_permissions: categories[3].id,
        created_at: new Date(),
        active: true,
      },
      // Permisos de Usuarios-Roles
      {
        name: 'crear-usuario-rol',
        description: 'Crea una relacion de usuario rol',
        id_category_permissions: categories[4].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-usuario-rol',
        description: 'Edita la relacion de usuario rol',
        id_category_permissions: categories[4].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-usuarios-roles',
        description: 'Permite listar las relaciones de usuario rol',
        id_category_permissions: categories[4].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-usuario-roles',
        description: 'Permite ver las relaciones de usuario rol',
        id_category_permissions: categories[4].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE VERIFICACION DE CORREO
      {
        name: 'verificar-correo-usuario',
        description: 'Permite verificar el correo electronico del usuario',
        id_category_permissions: categories[5].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'solicitar-enlace-verificacion-correo-usuario',
        description: 'Permite solicitar el enlace de verificacion nuevamente',
        id_category_permissions: categories[5].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE INICIO DE SESION
      {
        name: 'inicio-sesion',
        description: 'Permite iniciar sesion',
        id_category_permissions: categories[6].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE REGISTRO
      {
        name: 'registro-usuario',
        description: 'Permite crear cuenta del usuario para el sistema',
        id_category_permissions: categories[7].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE USUARIO
      {
        name: 'crear-usuario',
        description: 'Permite crear un usuario',
        id_category_permissions: categories[8].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-usuario-correo',
        description:
          'Permite visualizar el registro del usuario por medio del correo electronico',
        id_category_permissions: categories[8].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'cerrar-sesion',
        description: 'Permite cerrar la sesion del usuario',
        id_category_permissions: categories[8].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-mi-perfil',
        description: 'Permite ver el perfil del usuario',
        id_category_permissions: categories[8].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-mi-perfil',
        description: 'Permite editar el perfil del usuario',
        id_category_permissions: categories[8].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-nombre-usuario-menu',
        description: 'Permite ver el nombre del usuario en el menu',
        id_category_permissions: categories[8].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-perfil-usuario',
        description: 'Permite ver el perfil del usuario',
        id_category_permissions: categories[8].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-usuarios',
        description: 'Permite listar todos los usuarios',
        id_category_permissions: categories[8].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-usuario-nombre',
        description:
          'Permite visualizar el registro del usuario por medio del nombre de usuario',
        id_category_permissions: categories[8].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE ESTADOS GLOBALES
      {
        name: 'crear-estado-global',
        description: 'Permite crear un estado global',
        id_category_permissions: categories[9].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-estados-globales',
        description: 'Permite listar los estados globles registrados',
        id_category_permissions: categories[9].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-estado-global',
        description: 'Permite editar un estado global',
        id_category_permissions: categories[9].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-estado-global',
        description: 'Permite ver un estado global',
        id_category_permissions: categories[9].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-estado-global',
        description: 'Permite eliminar un estado global',
        id_category_permissions: categories[9].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE ESTADO CIVIL
      {
        name: 'crear-estado-civil',
        description: 'Permite crear un estado civil',
        id_category_permissions: categories[10].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-estados-civiles',
        description: 'Permite listar los estados civiles',
        id_category_permissions: categories[10].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-estado-civil',
        description: 'Permite editar un estado civil',
        id_category_permissions: categories[10].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-estado-civil',
        description: 'Permite ver un estado civil',
        id_category_permissions: categories[10].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-estado-civil',
        description: 'Permite eliminar un estado civil',
        id_category_permissions: categories[10].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE PAIS
      {
        name: 'crear-pais',
        description: 'Permite crear un pais',
        id_category_permissions: categories[11].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-paises',
        description: 'Permite listar paises',
        id_category_permissions: categories[11].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-pais',
        description: 'Permite editar un pais',
        id_category_permissions: categories[11].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-pais',
        description: 'Permite ver un pais',
        id_category_permissions: categories[11].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-pais',
        description: 'Permite eliminar un pais',
        id_category_permissions: categories[11].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS TIPO DIVISION GEOGRAFICA
      {
        name: 'crear-tipo-division-geografica',
        description: 'Permite crear un tipo de division geografica',
        id_category_permissions: categories[12].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-tipos-division-geografica',
        description: 'Permite listar tipos de division geografica',
        id_category_permissions: categories[12].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-tipo-division-geografica',
        description: 'Permite editar un tipo de division geografica',
        id_category_permissions: categories[12].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-tipo-division-geografica',
        description: 'Permite ver un tipo de division geografica',
        id_category_permissions: categories[12].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-tipo-division-geografica',
        description: 'Permite eliminar un tipo de division geografica',
        id_category_permissions: categories[12].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DIVISION GEOGRAFICA
      {
        name: 'crear-division-geografica',
        description: 'Permite crear una division geografica',
        id_category_permissions: categories[13].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-divisiones-geograficas',
        description: 'Permite listar divisiones geograficas',
        id_category_permissions: categories[13].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-division-geografica',
        description: 'Permite editar una division geografica',
        id_category_permissions: categories[13].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-division-geografica',
        description: 'Permite ver una division geografica',
        id_category_permissions: categories[13].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-division-geografica',
        description: 'Permite eliminar una division geografica',
        id_category_permissions: categories[13].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DOCUMENTO
      {
        name: 'crear-documento',
        description: 'Permite crear un documento',
        id_category_permissions: categories[14].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-documentos',
        description: 'Permite listar documentos',
        id_category_permissions: categories[14].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-documento',
        description: 'Permite editar un documento',
        id_category_permissions: categories[14].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-documento',
        description: 'Permite ver un documento',
        id_category_permissions: categories[14].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-documento',
        description: 'Permite eliminar un documento',
        id_category_permissions: categories[14].id,
        created_at: new Date(),
        active: true,
      },
      {
        // IDOR bypass — usuarios con este permiso pueden ver/editar/eliminar
        // documentos de otras personas, no sólo los suyos. Grant only to admin
        // roles. Read by OwnsResourceGuard in document.controller.ts.
        name: 'gestionar-cualquier-documento',
        description:
          'Permite gestionar (ver, editar, eliminar) documentos de cualquier persona',
        id_category_permissions: categories[14].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS TIPO DOCUMENTO
      {
        name: 'crear-tipo-documento',
        description: 'Permite crear un tipo de documento',
        id_category_permissions: categories[15].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-tipos-documentos',
        description: 'Permite listar los tipos de documentos',
        id_category_permissions: categories[15].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-tipo-documento',
        description: 'Permite editar un tipo de documento',
        id_category_permissions: categories[15].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-tipo-documento',
        description: 'Permite ver un tipo de documento',
        id_category_permissions: categories[15].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-tipo-documento',
        description: 'Permite eliminar un tipo de documento',
        id_category_permissions: categories[15].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DIRECCION
      {
        name: 'crear-dirección',
        description: 'Permite crear una direccion',
        id_category_permissions: categories[16].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-direcciones',
        description: 'Permite listar direcciones',
        id_category_permissions: categories[16].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-dirección',
        description: 'Permite editar una direccion',
        id_category_permissions: categories[16].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-dirección',
        description: 'Permite ver una direccion',
        id_category_permissions: categories[16].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-dirección',
        description: 'Permite eliminar una direccion',
        id_category_permissions: categories[16].id,
        created_at: new Date(),
        active: true,
      },
      {
        // IDOR bypass — usuarios con este permiso pueden ver/editar/eliminar
        // direcciones de otras personas, no sólo las suyas. Grant only to
        // admin roles. Read by OwnsResourceGuard in address.controller.ts.
        name: 'gestionar-cualquier-dirección',
        description:
          'Permite gestionar (ver, editar, eliminar) direcciones de cualquier persona',
        id_category_permissions: categories[16].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS PERSONA
      {
        name: 'crear-persona',
        description: 'Permite crear un registro de persona',
        id_category_permissions: categories[17].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-personas',
        description: 'Permite listar registros de persona',
        id_category_permissions: categories[17].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-persona',
        description: 'Permite editar un registro de persona',
        id_category_permissions: categories[17].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-persona',
        description: 'Permite ver un registro de persona',
        id_category_permissions: categories[17].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-persona',
        description: 'Permite eliminar un registro de persona',
        id_category_permissions: categories[17].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-persona-email',
        description:
          'Permite ver un registro de persona por correo electronico',
        id_category_permissions: categories[17].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE PROVEEDOR DE ALMACENAMIENTO
      {
        name: 'crear-proveedor-almacenamiento',
        description: 'Permite crear un proveedor de almacenamiento',
        id_category_permissions: categories[18].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-proveedores-almacenamiento',
        description: 'Permite listar proveedores de almacenamiento',
        id_category_permissions: categories[18].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-proveedor-almacenamiento',
        description: 'Permite editar un proveedor de almacenamiento',
        id_category_permissions: categories[18].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-proveedor-almacenamiento',
        description: 'Permite ver un proveedor de almacenamiento',
        id_category_permissions: categories[18].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-proveedor-almacenamiento',
        description: 'Permite eliminar un proveedor de almacenamiento',
        id_category_permissions: categories[18].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE DESTINO DE ALMACENAMIENTO
      {
        name: 'subir-multimedia-almacenamiento',
        description: 'Permite subir un registro de archivo multimedia',
        id_category_permissions: categories[19].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-archivos-almacenamiento',
        description: 'Lista los archivos multimedia almacenados',
        id_category_permissions: categories[19].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DEL LAYOUT
      {
        name: 'ver-layout',
        description: 'Permite ver el layout del sistema',
        id_category_permissions: categories[20].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS PARA LA VISTA TEST
      {
        name: 'ver-test-components',
        description: 'Permite ver la vista para testear componentes',
        id_category_permissions: categories[21].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS PARA EL TABLERO
      {
        name: 'ver-tablero',
        description: 'Permite ver la vista del tablero',
        id_category_permissions: categories[22].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISO MENU USUARIO
      {
        name: 'ver-menu-usuario',
        description:
          'Permite ver los elementos desplegables del menu usuario del avatar',
        id_category_permissions: categories[23].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE CATALOGOS
      {
        name: 'listar-catalogos',
        description:
          'Permite ver los catalogos del sistema para su mantenimiento y consulta',
        id_category_permissions: categories[24].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISOS DE ADMINISTRACION
      {
        name: 'listar-administracion',
        description:
          'Permite ver la administracion del sistema para su mantenimiento y consulta',
        id_category_permissions: categories[25].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'crear-categoria-estado',
        description:
          'Permite crear una nueva categoría de estado para el sistema',
        id_category_permissions: categories[26].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-categorias-estados',
        description: 'Permite listar las categorías de estado del sistema',
        id_category_permissions: categories[26].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'editar-categoria-estado',
        description: 'Permite editar las categorías de estado del sistema',
        id_category_permissions: categories[26].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'ver-categoria-estado',
        description: 'Permite ver las categorías de estado del sistema',
        id_category_permissions: categories[26].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'eliminar-categoria-estado',
        description: 'Permite eliminar las categorías de estado del sistema',
        id_category_permissions: categories[26].id,
        created_at: new Date(),
        active: true,
      },
      {
        name: 'listar-generos',
        description: 'Permite listar los géneros',
        id_category_permissions: categories[27].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISO DE DOCUMENTACION API
      {
        name: 'ver-documentacion-api',
        description: 'Permite acceder a la documentación interactiva de la API',
        id_category_permissions: categories[28].id,
        created_at: new Date(),
        active: true,
      },
      // PERMISO DE AUDITORIA
      {
        name: 'listar-audit-logs',
        description: 'Permite listar los logs de auditoría del sistema',
        id_category_permissions: categories[29].id,
        created_at: new Date(),
        active: true,
      },
    ],
    skipDuplicates: true,
  });
};
