import { CommandHandler, ICommandHandler, CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateReservationBalanceCommand } from './update-reservation-balance.command';
import { ReservationRepository } from '@/modules/reservations/domain/repositories/reservation-repository';
import { ReservationId } from '@/modules/reservations/domain/value-objects/reservation-id';
import { MarkInvoicesAsPaidByReservationCommand } from '@/modules/billing/application/commands/mark-invoices-paid-by-reservation/mark-invoices-paid-by-reservation.command';
import { GetReservationQuery } from '@/modules/reservations/application/queries/get-reservation/get-reservation.query';

@CommandHandler(UpdateReservationBalanceCommand)
export class UpdateReservationBalanceHandler implements ICommandHandler<UpdateReservationBalanceCommand> {
  constructor(
    private readonly repository: ReservationRepository,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateReservationBalanceCommand): Promise<void> {
    const id = new ReservationId(command.id);
    await this.repository.updateBalance(
      id,
      command.balance_due_delta,
      command.deposit_amount_delta,
    );

    const reservation = await this.queryBus.execute(new GetReservationQuery(command.id));
    if (reservation && reservation.balance_due <= 0) {
      await this.commandBus.execute(
        new MarkInvoicesAsPaidByReservationCommand(command.id)
      );
    }
  }
}
