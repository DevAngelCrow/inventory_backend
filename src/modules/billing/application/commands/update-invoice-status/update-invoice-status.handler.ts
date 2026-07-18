import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { UpdateInvoiceStatusCommand } from './update-invoice-status.command';
import { InvoiceRepository } from '../../../domain/repositories/invoice-repository';
import { InvoiceId } from '../../../domain/value-objects/invoice-value-object/invoice-id';
import { GetReservationQuery } from '@/modules/reservations/application/queries/get-reservation/get-reservation.query';

@CommandHandler(UpdateInvoiceStatusCommand)
export class UpdateInvoiceStatusHandler implements ICommandHandler<UpdateInvoiceStatusCommand> {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly queryBus: QueryBus
  ) {}

  async execute(command: UpdateInvoiceStatusCommand): Promise<void> {
    const id = new InvoiceId(command.id);
    const invoice = await this.repository.findById(id);
    if (!invoice) {
      throw new Error(`Invoice with id ${command.id} not found`);
    }

    if (command.status === 'VOIDED') {
      invoice.void();
    } else if (command.status === 'ISSUED') {
      const reservation = await this.queryBus.execute(
        new GetReservationQuery(invoice.getIdReservation().value())
      );
      if (reservation && reservation.balance_due <= 0) {
        invoice.updateStatus('PAID');
      } else {
        invoice.issue();
      }
    } else {
      invoice.updateStatus(command.status);
    }

    await this.repository.save(invoice);
  }
}
