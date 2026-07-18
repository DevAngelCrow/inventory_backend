export class ProcessPaymentCommand {
  constructor(
    public readonly id_reservation: string,
    public readonly id_payment_method: string,
    public readonly payment_method_code: string,
    public readonly amount: number,
    public readonly id_currency: string,
    public readonly payment_date: Date,
    public readonly reference_number?: string,
    public readonly notes?: string,
    public readonly id_received_by?: string,
    public readonly id_invoice?: string,
  ) {}
}
