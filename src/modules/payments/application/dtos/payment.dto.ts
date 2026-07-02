export class PaymentDto {
  constructor(
    public readonly id_reservation: string,
    public readonly id_payment_method: string,
    public readonly amount: number,
    public readonly payment_date: Date,
    public readonly status: {
      id: string;
      code: string;
      name: string;
      state_color: string;
      text_color: string;
    },
    public readonly payment_number?: string,
    public readonly reference_number?: string,
    public readonly notes?: string,
    public readonly gateway_provider?: string,
    public readonly gateway_tx_id?: string,
    public readonly gateway_response?: any,
    public readonly id_received_by?: string,
    public readonly id?: string,
    public readonly created_at?: Date | null,
    public readonly updated_at?: Date | null,
    public readonly mnt_reservation?: any,
  ) {}
}
