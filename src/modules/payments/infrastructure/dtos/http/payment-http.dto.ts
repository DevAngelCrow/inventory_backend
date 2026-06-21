import { PaymentDto } from '@/modules/payments/application/dtos/payment.dto';

export class PaymentHttpDto {
  constructor(
    public readonly id: string,
    public readonly id_reservation: string,
    public readonly id_payment_method: string,
    public readonly amount: number,
    public readonly payment_date: Date,
    public readonly status: { id: string; code: string; name: string; state_color: string; text_color: string; },
    public readonly payment_number?: string,
    public readonly reference_number?: string,
    public readonly notes?: string,
    public readonly gateway_provider?: string,
    public readonly gateway_tx_id?: string,
    public readonly gateway_response?: any,
    public readonly id_received_by?: string,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
    public readonly mnt_reservation?: any,
  ) {}

  public static fromDto(dto: PaymentDto): PaymentHttpDto {
    return new PaymentHttpDto(
      dto.id!,
      dto.id_reservation,
      dto.id_payment_method,
      dto.amount,
      dto.payment_date,
      dto.status,
      dto.payment_number,
      dto.reference_number,
      dto.notes,
      dto.gateway_provider,
      dto.gateway_tx_id,
      dto.gateway_response,
      dto.id_received_by,
      dto.created_at,
      dto.updated_at,
      dto.mnt_reservation,
    );
  }
}
