import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteReservationCommand } from './delete-reservation.command';
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { ReservationId } from '@/modules/reservations/domain/value-objects/reservation-id';

@CommandHandler(DeleteReservationCommand)
export class DeleteReservationHandler implements ICommandHandler<DeleteReservationCommand> {
  constructor(private readonly repository: ReservationRepository) {}

  async execute(command: DeleteReservationCommand): Promise<void> {
    const id = new ReservationId(command.id);
    await this.repository.delete(id);
  }
}
