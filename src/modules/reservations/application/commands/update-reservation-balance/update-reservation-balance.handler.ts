import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateReservationBalanceCommand } from './update-reservation-balance.command';
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { ReservationId } from '@/modules/reservations/domain/value-objects/reservation-id';

@CommandHandler(UpdateReservationBalanceCommand)
export class UpdateReservationBalanceHandler implements ICommandHandler<UpdateReservationBalanceCommand> {
  constructor(private readonly repository: ReservationRepository) {}

  async execute(command: UpdateReservationBalanceCommand): Promise<void> {
    const id = new ReservationId(command.id);
    await this.repository.updateBalance(id, command.balance_due_delta, command.deposit_amount_delta);
  }
}
