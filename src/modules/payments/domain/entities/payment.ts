import { PaymentId } from '../value-objects/payment-id';
import { PaymentAmount } from '../value-objects/payment-amount';
import { PaymentDate } from '../value-objects/payment-date';
import { PaymentMethodId } from '../value-objects/payment-method-id';
import { PaymentStatus } from '../value-objects/payment-status';
import { PaymentReservationId } from '../value-objects/payment-reservation-id';
import { PaymentReferenceNumber } from '../value-objects/payment-reference-number';
import { PaymentNotes } from '../value-objects/payment-notes';
import { PaymentGatewayProvider } from '../value-objects/payment-gateway-provider';
import { PaymentGatewayTxId } from '../value-objects/payment-gateway-tx-id';
import { PaymentGatewayResponse } from '../value-objects/payment-gateway-response';
import { PaymentReceivedById } from '../value-objects/payment-received-by-id';

export class Payment {
  constructor(
    private readonly id_reservation: PaymentReservationId,
    private readonly id_payment_method: PaymentMethodId,
    private readonly amount: PaymentAmount,
    private readonly payment_date: PaymentDate,
    private status: PaymentStatus,
    private readonly reference_number?: PaymentReferenceNumber,
    private readonly notes?: PaymentNotes,
    private readonly gateway_provider?: PaymentGatewayProvider,
    private readonly gateway_tx_id?: PaymentGatewayTxId,
    private readonly gateway_response?: PaymentGatewayResponse,
    private readonly id_received_by?: PaymentReceivedById,
    private readonly id?: PaymentId,
  ) {}

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
      new PaymentReservationId(data.id_reservation),
      new PaymentMethodId(data.id_payment_method),
      new PaymentAmount(data.amount),
      new PaymentDate(data.payment_date),
      new PaymentStatus(data.status),
      data.reference_number
        ? new PaymentReferenceNumber(data.reference_number)
        : undefined,
      data.notes ? new PaymentNotes(data.notes) : undefined,
      data.gateway_provider
        ? new PaymentGatewayProvider(data.gateway_provider)
        : undefined,
      data.gateway_tx_id
        ? new PaymentGatewayTxId(data.gateway_tx_id)
        : undefined,
      data.gateway_response !== undefined
        ? new PaymentGatewayResponse(data.gateway_response)
        : undefined,
      data.id_received_by
        ? new PaymentReceivedById(data.id_received_by)
        : undefined,
      data.id ? new PaymentId(data.id) : undefined,
    );
  }

  public getId(): PaymentId | undefined {
    return this.id;
  }
  public getIdReservation(): PaymentReservationId {
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
  public getReferenceNumber(): PaymentReferenceNumber | undefined {
    return this.reference_number;
  }
  public getNotes(): PaymentNotes | undefined {
    return this.notes;
  }
  public getGatewayProvider(): PaymentGatewayProvider | undefined {
    return this.gateway_provider;
  }
  public getGatewayTxId(): PaymentGatewayTxId | undefined {
    return this.gateway_tx_id;
  }
  public getGatewayResponse(): PaymentGatewayResponse | undefined {
    return this.gateway_response;
  }
  public getIdReceivedBy(): PaymentReceivedById | undefined {
    return this.id_received_by;
  }

  public void(): void {
    if (this.status.value() === 'CANCELLED') {
      throw new Error('Payment is already cancelled');
    }
    this.status = new PaymentStatus('CANCELLED');
  }
}
