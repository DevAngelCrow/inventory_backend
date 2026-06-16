import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateReservationCommand } from './update-reservation.command';
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { Reservation } from '@/modules/reservations/domain/entities/reservation';

@CommandHandler(UpdateReservationCommand)
export class UpdateReservationHandler implements ICommandHandler<UpdateReservationCommand> {
  constructor(private readonly repository: ReservationRepository) {}

  async execute(command: UpdateReservationCommand): Promise<void> {
    const reservation = Reservation.create({
      id: command.id,
      id_customer: command.id_customer,
      status: command.status,
      event_start: command.event_start,
      event_end: command.event_end,
      total_amount: command.total_amount,
      delivery_address: command.delivery_address,
      deposit_amount: command.deposit_amount,
      balance_due: command.balance_due,
      notes: command.notes,
      items: command.items.map(i => ({
        id_product: i.id_product,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total_price: i.total_price,
      })),
    });
    await this.repository.update(reservation);
  }
}
