import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateReservationCommand } from './create-reservation.command';
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { Reservation } from '@/modules/reservations/domain/entities/reservation';

@CommandHandler(CreateReservationCommand)
export class CreateReservationHandler implements ICommandHandler<CreateReservationCommand> {
  constructor(private readonly repository: ReservationRepository) {}

  async execute(command: CreateReservationCommand): Promise<void> {
    const reservation = Reservation.create({
      id_customer: command.id_customer,
      status: 'PENDING',
      event_start: command.event_start,
      event_end: command.event_end,
      total_amount: command.total_amount,
      delivery_address: command.delivery_address,
      delivery_address_line2: command.delivery_address_line2,
      delivery_zip: command.delivery_zip,
      delivery_notes: command.delivery_notes,
      id_customer_address: command.id_customer_address,
      id_geographic_division: command.id_geographic_division,
      deposit_amount: command.deposit_amount,
      balance_due: command.balance_due,
      delivery_fee: command.delivery_fee,
      discount_amount: command.discount_amount,
      notes: command.notes,
      items: command.items.map((i) => ({
        id_product: i.id_product,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total_price: i.total_price,
      })),
    });
    await this.repository.create(reservation);
  }
}
