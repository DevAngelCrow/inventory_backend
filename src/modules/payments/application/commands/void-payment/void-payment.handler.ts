import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { VoidPaymentCommand } from './void-payment.command';
import { PaymentRepository } from '@/modules/payments/domain/repositories/payment-repository';
import { PaymentQueriesRepository } from '@/modules/payments/application/repositories/payment-read.repository';
import { Payment } from '@/modules/payments/domain/entities/payment';
import { UpdateReservationBalanceCommand } from '@/modules/reservations/application/commands/update-reservation-balance/update-reservation-balance.command';

@CommandHandler(VoidPaymentCommand)
export class VoidPaymentHandler implements ICommandHandler<VoidPaymentCommand> {
  constructor(
    private readonly repository: PaymentRepository,
    private readonly queriesRepository: PaymentQueriesRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: VoidPaymentCommand): Promise<Payment> {
    const paymentDto = await this.queriesRepository.findById(command.id);
    if (!paymentDto) {
      throw new Error(`Payment with id ${command.id} not found`);
    }

    const payment = Payment.create({
      id: paymentDto.id,
      id_reservation: paymentDto.id_reservation,
      id_payment_method: paymentDto.id_payment_method,
      amount: paymentDto.amount,
      payment_date: paymentDto.payment_date,
      status: paymentDto.status.code,
      reference_number: paymentDto.reference_number,
      notes: paymentDto.notes,
      gateway_provider: paymentDto.gateway_provider,
      gateway_tx_id: paymentDto.gateway_tx_id,
      gateway_response: paymentDto.gateway_response,
      id_received_by: paymentDto.id_received_by,
    });

    payment.void();
    
    const savedPayment = await this.repository.save(payment);

    // Revert reservation balance via CommandBus
    await this.commandBus.execute(
      new UpdateReservationBalanceCommand(
        paymentDto.id_reservation,
        paymentDto.amount,  // balance_due_delta (increment)
        -paymentDto.amount  // deposit_amount_delta (decrement)
      )
    );

    return savedPayment;
  }
}
