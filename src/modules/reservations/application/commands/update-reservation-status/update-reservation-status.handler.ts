import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { UpdateReservationStatusCommand } from './update-reservation-status.command';
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { ReservationQueriesRepository } from '../../repositories/reservation-read.repository';
import { ReservationId } from '@/modules/reservations/domain/value-objects/reservation-id';
import { Reservation } from '@/modules/reservations/domain/entities/reservation';
import { GenerateInvoiceCommand } from '@/modules/billing/application/commands/generate-invoice/generate-invoice.command';
import { PrismaService } from '@/shared/infrastructure/persistence/prisma/prisma.service';

@CommandHandler(UpdateReservationStatusCommand)
export class UpdateReservationStatusHandler implements ICommandHandler<UpdateReservationStatusCommand> {
  constructor(
    private readonly repository: ReservationRepository,
    private readonly queriesRepository: ReservationQueriesRepository,
    private readonly commandBus: CommandBus,
    private readonly prisma: PrismaService,
  ) {}

  async execute(command: UpdateReservationStatusCommand): Promise<Reservation> {
    const id = new ReservationId(command.id);
    const updated = await this.repository.updateStatus(id, command.status);

    if (command.status === 'CONFIRMED') {
      const reservation = await this.queriesRepository.findById(command.id);
      if (reservation) {
        let id_currency = '00000000-0000-0000-0000-000000000000';
        try {
          const defaultCurrency = await this.prisma.client.ctl_currency.findFirst({
              where: { active: true },
          });
          if (defaultCurrency) id_currency = defaultCurrency.id;
        } catch (e) {
          // ignore
        }

        const generateInvoiceCmd = new GenerateInvoiceCommand(
          reservation.id!,
          reservation.id_customer,
          id_currency,
          new Date(), // issue date
          reservation.event_start, // due date
          reservation.total_amount, // subtotal
          0, // tax rate
          0, // tax amount
          0, // discount
          0, // delivery
          0, // damage charges
          reservation.total_amount, // total
          'DRAFT', // status
          'Auto-generated from reservation confirmation',
          undefined,
          reservation.items.map(i => ({
            description: i.mnt_product?.name || 'Item',
            quantity: i.quantity,
            unit_price: i.unit_price,
            subtotal: i.total_price,
            tax_amount: 0,
            total: i.total_price,
            id_product: i.id_product,
          }))
        );
        // We catch errors so the status update doesn't fail if billing fails
        try {
          await this.commandBus.execute(generateInvoiceCmd);
          require('fs').appendFileSync('error_log.txt', 'Invoice generated successfully for ' + reservation.id + '\n');
        } catch (e: any) {
          console.error('Failed to auto-generate invoice', e);
          require('fs').appendFileSync('error_log.txt', 'Error: ' + e.message + '\n' + e.stack + '\n');
        }
      }
    }

    return updated;
  }
}
