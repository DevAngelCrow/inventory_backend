import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { ProcessPaymentCommand } from './process-payment.command';
import { PaymentRepository } from '@/modules/payments/domain/repositories/payment-repository';
import { PaymentGatewayPort } from '@/modules/payments/application/ports/payment-gateway.port';
import { Payment } from '@/modules/payments/domain/entities/payment';
import { UpdateReservationBalanceCommand } from '@/modules/reservations/application/commands/update-reservation-balance/update-reservation-balance.command';

@CommandHandler(ProcessPaymentCommand)
export class ProcessPaymentHandler implements ICommandHandler<ProcessPaymentCommand> {
  constructor(
    private readonly repository: PaymentRepository,
    private readonly paymentGateway: PaymentGatewayPort,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<Payment> {
    // 1. Process via gateway (abstracted)
    const result = await this.paymentGateway.process({
      amount: command.amount,
      currency: command.id_currency, // En un sistema real buscaríamos el código ISO de la moneda
      paymentMethodCode: command.payment_method_code,
      referenceNumber: command.reference_number,
    });

    // 2. Create Domain Entity
    const payment = Payment.create({
      id_reservation: command.id_reservation,
      id_payment_method: command.id_payment_method,
      amount: command.amount,
      payment_date: command.payment_date,
      status: result.status,
      reference_number: command.reference_number,
      notes: command.notes,
      gateway_provider: result.gatewayProvider,
      gateway_tx_id: result.gatewayTxId,
      gateway_response: result.gatewayResponse,
      id_received_by: command.id_received_by,
    });

    // 3. Save to repository
    const savedPayment = await this.repository.save(payment);

    // 4. Update Reservation Balance via CommandBus
    if (result.status === 'COMPLETED') {
      await this.commandBus.execute(
        new UpdateReservationBalanceCommand(
          command.id_reservation,
          -command.amount, // balance_due_delta (decrement)
          command.amount, // deposit_amount_delta (increment)
        ),
      );
    }

    return savedPayment;
  }
}
