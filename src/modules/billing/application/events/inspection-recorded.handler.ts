import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InspectionRecordedEvent } from '../../../inspections/domain/events/inspection-recorded.event';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';

@EventsHandler(InspectionRecordedEvent)
export class InspectionRecordedHandler implements IEventHandler<InspectionRecordedEvent> {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async handle(event: InspectionRecordedEvent) {
    console.log(`[InspectionRecordedHandler] Event received for reservation: ${event.id_reservation} with charges: ${event.total_charges}`);
    if (event.total_charges <= 0) {
      console.log(`[InspectionRecordedHandler] Total charges <= 0, skipping invoice generation`);
      return;
    }

    try {
      // Obtener la reservación para tener el id_customer e id_currency
      const reservation = await this.prisma.client.mnt_reservation.findUnique({
        where: { id: event.id_reservation },
      });

      if (!reservation) {
        console.error(`[InspectionRecordedHandler] Reservation ${event.id_reservation} not found`);
        return;
      }

      // Obtener estado DRAFT de la categoría de facturas (INV)
      const draftStatus = await this.prisma.client.ctl_status.findFirstOrThrow({
        where: { code: 'DRAFT', ctl_category_status: { code: 'INV' } },
      });

      const { randomUUID } = await import('crypto');
      const invoiceNumber = `DMG-${randomUUID().replace(/-/g, '').slice(0, 10).toUpperCase()}`;


      // Crear factura directamente en la base de datos
      const invoice = await this.prisma.client.mnt_invoice.create({
        data: {
          id_reservation: event.id_reservation,
          id_customer: reservation.id_customer,
          id_currency: reservation.id_currency,
          id_status: draftStatus.id,
          invoice_number: invoiceNumber,
          issue_date: new Date(),
          subtotal: event.total_charges,
          tax_rate: 0,
          tax_amount: 0,
          discount_amount: 0,
          delivery_fee: 0,
          damage_charges: event.total_charges,
          total: event.total_charges,
          notes: 'Factura por daños registrados en inspección',
          created_at: new Date(),
        },
      });

      // Crear la línea de factura
      await this.prisma.client.mnt_invoice_line.create({
        data: {
          id_invoice: invoice.id,
          description: 'Cargos adicionales por daños o pérdidas reportados en inspección',
          quantity: 1,
          unit_price: event.total_charges,
          subtotal: event.total_charges,
          sort_order: 0,
        },
      });

      console.log(`[InspectionRecordedHandler] Damage invoice ${invoiceNumber} created successfully (id: ${invoice.id})`);
    } catch (error) {
      console.error(`[InspectionRecordedHandler] Error creating damage invoice:`, error);
    }
  }
}
