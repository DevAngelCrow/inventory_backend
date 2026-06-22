import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { UpdateReservationStatusCommand } from './update-reservation-status.command';
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { ReservationQueriesRepository } from '../../repositories/reservation-read.repository';
import { ReservationId } from '@/modules/reservations/domain/value-objects/reservation-id';
import { Reservation } from '@/modules/reservations/domain/entities/reservation';
import { GenerateInvoiceCommand } from '@/modules/billing/application/commands/generate-invoice/generate-invoice.command';

@CommandHandler(UpdateReservationStatusCommand)
export class UpdateReservationStatusHandler implements ICommandHandler<UpdateReservationStatusCommand> {
  private readonly logger = new Logger(UpdateReservationStatusHandler.name);

  constructor(
    private readonly repository: ReservationRepository,
    private readonly queriesRepository: ReservationQueriesRepository,
    private readonly commandBus: CommandBus,
  ) { }

  async execute(command: UpdateReservationStatusCommand): Promise<Reservation> {
    const updated = await this.repository.updateStatus(
      new ReservationId(command.id),
      command.status,
      command.deliveryDatetime,
      command.pickupDatetime,
    );

    if (command.status === 'CONFIRMED') {
      const reservation = await this.queriesRepository.findById(command.id);
      if (reservation) {
        const id_currency = await this.queriesRepository.getDefaultCurrencyId();

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
          this.logger.log(`Invoice generated successfully for ${reservation.id}`);
        } catch (e: any) {
          this.logger.error(`Failed to auto-generate invoice for ${reservation.id}`, e.stack);
        }
      }
    }

    return updated;
  }
}
