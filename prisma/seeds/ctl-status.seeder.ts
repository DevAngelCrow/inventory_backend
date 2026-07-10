import { PrismaClient } from 'generated/prisma/client';

export const seedCtlStatus = async (tx: PrismaClient) => {

  console.log('Seeding ctl_status data ...');
  await tx.ctl_status.createMany({
    data: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        code: 'AC',
        name: 'Activo',
        description: 'Estado activo',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000001",
        state_color: '#008000',
      },
      {
        id: "00000000-0000-4000-8000-000000000002",
        code: 'IN',
        name: 'Inactivo',
        description: 'Estado inactivo',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000001",
        state_color: '#FF0000',
      },
      {
        id: "00000000-0000-4000-8000-000000000003",
        code: 'PND',
        name: 'Pendiente',
        description: 'Estado pendiente',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000001",
        state_color: '#FFCA28',
      },
      {
        id: "00000000-0000-4000-8000-000000000004",
        code: 'NV',
        name: 'No Verificado',
        description: 'Estado de usuario sin verificar su cuenta de correo',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000001",
        state_color: '#E0E0E0',
      },
      {
        id: "00000000-0000-4000-8000-000000000005",
        code: 'AC',
        name: 'Activo',
        description: 'Estado activo para columnas booleanas.',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000002",
        state_color: '#008000',
      },
      {
        id: "00000000-0000-4000-8000-000000000006",
        code: 'INA',
        name: 'Inactivo',
        description: 'Estado inactivo para columnas booleanas.',
        active: true,
        id_category_status: "00000000-0000-4000-8000-000000000002",
        state_color: '#FF0000',
      },
      // Reservaciones
      {
        id: "20000000-0000-4000-8000-000000000001",
        code: "PENDING",
        name: "Pendiente",
        description: "Pendiente",
        state_color: "#f59e0b",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000003",
        active: true
      },
      {
        id: "20000000-0000-4000-8000-000000000002",
        code: "CONFIRMED",
        name: "Confirmada",
        description: "Confirmada",
        state_color: "#3b82f6",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000003",
        active: true
      },
      {
        id: "20000000-0000-4000-8000-000000000003",
        code: "IN_PROGRESS",
        name: "En Progreso",
        description: "En Progreso",
        state_color: "#6366f1",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000003",
        active: true
      },
      {
        id: "20000000-0000-4000-8000-000000000004",
        code: "COMPLETED",
        name: "Completada",
        description: "Completada",
        state_color: "#22c55e",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000003",
        active: true
      },
      {
        id: "20000000-0000-4000-8000-000000000005",
        code: "CANCELLED",
        name: "Cancelada",
        description: "Cancelada",
        state_color: "#ef4444",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000003",
        active: true
      },
      // Facturas
      {
        id: "30000000-0000-4000-8000-000000000001",
        code: "DRAFT",
        name: "Borrador",
        description: "Borrador",
        state_color: "#1e293b",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000004",
        active: true
      },
      {
        id: "30000000-0000-4000-8000-000000000002",
        code: "ISSUED",
        name: "Emitida",
        description: "Emitida",
        state_color: "#3b82f6",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000004",
        active: true
      },
      {
        id: "30000000-0000-4000-8000-000000000003",
        code: "PAID",
        name: "Pagada",
        description: "Pagada",
        state_color: "#22c55e",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000004",
        active: true
      },
      {
        id: "30000000-0000-4000-8000-000000000004",
        code: "VOIDED",
        name: "Anulada",
        description: "Anulada",
        state_color: "#ef4444",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000004",
        active: true
      },
      // Pagos
      {
        id: "40000000-0000-4000-8000-000000000001",
        code: "PENDING",
        name: "Pendiente",
        description: "Pendiente",
        state_color: "#f59e0b",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000005",
        active: true
      },
      {
        id: "40000000-0000-4000-8000-000000000002",
        code: "COMPLETED",
        name: "Completado",
        description: "Completado",
        state_color: "#22c55e",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000005",
        active: true
      },
      {
        id: "40000000-0000-4000-8000-000000000003",
        code: "FAILED",
        name: "Fallido",
        description: "Fallido",
        state_color: "#ef4444",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000005",
        active: true
      },
      {
        id: "40000000-0000-4000-8000-000000000004",
        code: "REFUNDED",
        name: "Reembolsado",
        description: "Reembolsado",
        state_color: "#8b5cf6",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000005",
        active: true
      },
      // Inspecciones
      {
        id: "50000000-0000-4000-8000-000000000001",
        code: "PENDING",
        name: "Pendiente",
        description: "Pendiente",
        state_color: "#f59e0b",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000006",
        active: true
      },
      {
        id: "50000000-0000-4000-8000-000000000002",
        code: "IN_PROGRESS",
        name: "En Progreso",
        description: "En Progreso",
        state_color: "#3b82f6",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000006",
        active: true
      },
      {
        id: "50000000-0000-4000-8000-000000000003",
        code: "COMPLETED",
        name: "Completada",
        description: "Completada",
        state_color: "#22c55e",
        text_color: "#ffffff",
        id_category_status: "00000000-0000-4000-8000-000000000006",
        active: true
      }
    ],
    skipDuplicates: true,
  });
};
