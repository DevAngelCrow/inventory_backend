import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MarkInvoicesAsPaidByReservationCommand } from './mark-invoices-paid-by-reservation.command';
import { InvoiceRepository } from '../../../domain/repositories/invoice-repository';

@CommandHandler(MarkInvoicesAsPaidByReservationCommand)
export class MarkInvoicesAsPaidByReservationHandler implements ICommandHandler<MarkInvoicesAsPaidByReservationCommand> {
  constructor(private readonly repository: InvoiceRepository) {}

  async execute(command: MarkInvoicesAsPaidByReservationCommand): Promise<void> {
    await this.repository.markInvoicesAsPaidByReservation(command.id_reservation);
  }
}
