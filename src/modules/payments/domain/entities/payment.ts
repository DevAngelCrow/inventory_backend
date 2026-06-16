import { PaymentId } from '../value-objects/payment-id';
import { PaymentAmount } from '../value-objects/payment-amount';
import { PaymentDate } from '../value-objects/payment-date';
import { PaymentMethodId } from '../value-objects/payment-method-id';
import { PaymentStatus } from '../value-objects/payment-status';

export class Payment {
  constructor(
    private readonly id_reservation: string,
    private readonly id_payment_method: PaymentMethodId,
    private readonly amount: PaymentAmount,
    private readonly payment_date: PaymentDate,
    private readonly status: PaymentStatus,
    private readonly reference_number?: string,
    private readonly notes?: string,
    private readonly gateway_provider?: string,
    private readonly gateway_tx_id?: string,
    private readonly gateway_response?: any,
    private readonly id_received_by?: string,
    private readonly id?: PaymentId,
  ) { }

  static create(data: {
    id_reservation: string;
    id_payment_method: string;
    amount: number;
    payment_date: Date;
    status: string;
    reference_number?: string;
    notes?: string;
    gateway_provider?: string;
    gateway_tx_id?: string;
    gateway_response?: any;
    id_received_by?: string;
    id?: string;
  }): Payment {
    return new Payment(
      data.id_reservation,
      new PaymentMethodId(data.id_payment_method),
      new PaymentAmount(data.amount),
      new PaymentDate(data.payment_date),
      new PaymentStatus(data.status),
      data.reference_number,
      data.notes,
      data.gateway_provider,
      data.gateway_tx_id,
      data.gateway_response,
      data.id_received_by,
      data.id ? new PaymentId(data.id) : undefined,
    );
  }

  public getId(): PaymentId | undefined {
    return this.id;
  }
  public getIdReservation(): string {
    return this.id_reservation;
  }
  public getIdPaymentMethod(): PaymentMethodId {
    return this.id_payment_method;
  }
  public getAmount(): PaymentAmount {
    return this.amount;
  }
  public getPaymentDate(): PaymentDate {
    return this.payment_date;
  }
  public getStatus(): PaymentStatus {
    return this.status;
  }
  public getReferenceNumber(): string | undefined {
    return this.reference_number;
  }
  public getNotes(): string | undefined {
    return this.notes;
  }
  public getGatewayProvider(): string | undefined {
    return this.gateway_provider;
  }
  public getGatewayTxId(): string | undefined {
    return this.gateway_tx_id;
  }
  public getGatewayResponse(): any {
    return this.gateway_response;
  }
  public getIdReceivedBy(): string | undefined {
    return this.id_received_by;
  }

  public void(): void {
    if (this.status.value() === 'CANCELLED') {
      throw new Error('Payment is already cancelled');
    }
    // We update the underlying value object in a simple way for now
    // In a stricter DDD setup, we might re-instantiate PaymentStatus
    (this as any).status = new PaymentStatus('CANCELLED');
  }
}
