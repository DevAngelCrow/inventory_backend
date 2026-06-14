import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateReservationStatusCommand } from './update-reservation-status.command';
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { ReservationId } from '@/modules/reservations/domain/value-objects/reservation-id';
import { Reservation } from '@/modules/reservations/domain/entities/reservation';

@CommandHandler(UpdateReservationStatusCommand)
export class UpdateReservationStatusHandler implements ICommandHandler<UpdateReservationStatusCommand> {
  constructor(private readonly repository: ReservationRepository) {}

  async execute(command: UpdateReservationStatusCommand): Promise<Reservation> {
    const id = new ReservationId(command.id);
    return await this.repository.updateStatus(id, command.status);
  }
}
